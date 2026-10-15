import { randomUUID } from 'node:crypto';
export async function synchronizeOne(pool, cfg, {sid, force=false, fetchImpl=fetch} = {}) {
  const conn = await pool.getConnection();
  const token = randomUUID(); let row;
  try {
    await conn.beginTransaction();
    const [rows] = await conn.execute(`SELECT * FROM olympiad_attempts
      WHERE (sync_status IN ('pending','failed') OR (sync_status='syncing' AND sync_lease_until < UTC_TIMESTAMP(3)))
      ${sid ? 'AND sid=?' : ''}
      ${force ? '' : 'AND (sync_next_attempt_at IS NULL OR sync_next_attempt_at <= UTC_TIMESTAMP(3))'}
      ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED`, sid ? [sid] : []);
    row=rows[0];
    if (row) await conn.execute(`UPDATE olympiad_attempts SET sync_status='syncing',sync_token=?,
      sync_attempts=sync_attempts+1,sync_last_attempt_at=UTC_TIMESTAMP(3),
      sync_lease_until=TIMESTAMPADD(SECOND,?,UTC_TIMESTAMP(3)) WHERE sid=?`, [token,Math.ceil(cfg.syncTimeout/1000)+60,row.sid]);
    await conn.commit();
  } catch(err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
  if (!row) return null;
  try {
    const payload = typeof row.payload==='string' ? JSON.parse(row.payload) : row.payload;
    const response = await fetchImpl(cfg.url, {method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),redirect:'follow',signal:AbortSignal.timeout(cfg.syncTimeout)});
    if (!response.ok) throw new Error(`Apps Script HTTP ${response.status}`);
    const result = await response.json();
    if (result?.ok !== true) throw new Error(`Apps Script: ${String(result?.error || 'ok:true missing').slice(0,1000)}`);
    // Detect a deployed grader differing from the supplied Code.gs.
    if (result.score !== row.score_total || result.max !== row.score_max) throw new Error('Apps Script score differs from the saved server grade; verify deployed Code.gs');
    await pool.execute(`UPDATE olympiad_attempts SET sync_status='synced',sync_response=?,synced_at=UTC_TIMESTAMP(3),
      sync_error=NULL,sync_lease_until=NULL,sync_token=NULL,sync_next_attempt_at=NULL WHERE sid=? AND sync_token=?`,
      [JSON.stringify({ok:true,score:result.score,max:result.max,dup:result.dup===true}),row.sid,token]);
    return {sid:row.sid,status:'synced'};
  } catch(err) {
    const delay = Math.min(3600,30*2**Math.min(row.sync_attempts,7));
    await pool.execute(`UPDATE olympiad_attempts SET sync_status='failed',sync_error=?,sync_lease_until=NULL,sync_token=NULL,
      sync_next_attempt_at=TIMESTAMPADD(SECOND,?,UTC_TIMESTAMP(3)) WHERE sid=? AND sync_token=?`,
      [String(err.message).slice(0,2000),delay,row.sid,token]);
    return {sid:row.sid,status:'failed'};
  }
}
export function startWorker(pool,cfg) {
  let busy=false, stopped=false;
  const run=async()=>{if(busy||stopped)return;busy=true;try{
    for(let i=0;i<20&&!stopped;i++)if(!await synchronizeOne(pool,cfg))break;
  }catch(err){console.error('Sync worker unavailable:',err.code||err.name)}finally{busy=false}};
  const timer=setInterval(run,cfg.syncInterval);run();
  return {wake:run,stop:()=>{stopped=true;clearInterval(timer)}};
}
