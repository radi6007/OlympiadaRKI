import mysql from 'mysql2/promise';
import { payloadHash, RequestError } from './validation.js';
export const createPool = cfg => mysql.createPool(cfg.mysql);
export async function saveAttempt(pool, scoring, payload) {
  const d = payload, hash = payloadHash(d), grade = scoring.grade(d.testId, d.answers);
  // One durable InnoDB insert also enqueues synchronization; there is no gap
  // between saving the result and adding its outbox record.
  try {
    await pool.execute(`INSERT INTO olympiad_attempts
      (sid,test_id,surname,given_name,email,answers,payload,payload_hash,started_at,finished_at,
       duration_seconds,auto_finished,audio_plays,lang,user_agent,score_total,score_max,
       score_parts,score_per_question,scoring_version,google_sheet)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [d.sid,d.testId,d.surname,d.name,d.email,JSON.stringify(d.answers),JSON.stringify(d),hash,
        new Date(d.startedAt),new Date(d.finishedAt),d.seconds,d.auto,d.plays,d.lang,d.ua,
        grade.total,grade.max,JSON.stringify(grade.parts),JSON.stringify(grade.per),scoring.version,scoring.tests[d.testId].sheet]);
  } catch (err) {
    if (err.code !== 'ER_DUP_ENTRY') throw err;
    const [rows] = await pool.execute('SELECT payload_hash FROM olympiad_attempts WHERE sid=?', [d.sid]);
    if (rows[0]?.payload_hash !== hash) throw new RequestError('This attempt ID already contains different data', 409);
  }
  return {ok:true, saved:true, sid:d.sid, testId:d.testId};
}
