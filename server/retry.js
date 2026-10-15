import { config } from './config.js';
import { createPool } from './db.js';
import { synchronizeOne } from './sync.js';
const cfg=config(),pool=createPool(cfg);
const args=process.argv.slice(2), sid=args[0]==='--sid'?args[1]:undefined;
if(args.length && !sid){console.error('Usage: npm run sync:retry -- [--sid SID]');process.exit(1)}
try{
  // Snapshot prevents an immediate retry loop when a service remains unavailable.
  const [rows]=await pool.execute(`SELECT sid FROM olympiad_attempts WHERE
    (sync_status IN ('pending','failed') OR (sync_status='syncing' AND sync_lease_until<UTC_TIMESTAMP(3))) ${sid?'AND sid=?':''}`,sid?[sid]:[]);
  for(const row of rows){const result=await synchronizeOne(pool,cfg,{sid:row.sid,force:true});if(result){console.log(JSON.stringify(result));if(result.status==='failed')process.exitCode=1}}
  if(!rows.length)console.log('No eligible attempts');
}finally{await pool.end()}
