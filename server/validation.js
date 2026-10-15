import { createHash } from 'node:crypto';
const slugs = ['rki-1','rki-2','rki-3','rku-1','rku-2','rku-3'];
export const schemas = Object.fromEntries(await Promise.all(slugs.map(async slug => {
  const {TEST, Q} = await import(`../src/tests/${slug}/data.js`); return [TEST.id, {TEST, Q}];
})));
export class RequestError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const letters = ['А','Б','В','Г','Д','Е'];
export function validate(d) {
  const fail = () => { throw new RequestError('Invalid attempt data'); };
  if (!object(d)) fail();
  const required = ['testId','sid','surname','name','email','answers','startedAt','finishedAt','seconds','auto','plays','lang','ua'];
  if (Object.keys(d).some(k => !required.includes(k)) || required.some(k => !(k in d))) fail();
  if (!Object.hasOwn(schemas,d.testId)) fail();
  const schema = schemas[d.testId];
  if (typeof d.sid !== 'string' || !/^[a-zA-Z0-9_-]{16,100}$/.test(d.sid)) fail();
  for (const key of ['surname','name']) if (typeof d[key] !== 'string' || !d[key].trim() || d[key].length > 60) fail();
  if (typeof d.email !== 'string' || d.email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) fail();
  const dates = [d.startedAt, d.finishedAt];
  if (dates.some(v => typeof v !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(v) || !Number.isFinite(Date.parse(v)))) fail();
  const start = Date.parse(d.startedAt), end = Date.parse(d.finishedAt);
  if (start < Date.UTC(2020,0,1) || end < start || end > Date.now()+300000 || end-start > 366*86400000) fail();
  if (!Number.isInteger(d.seconds) || Math.abs(d.seconds-Math.round((end-start)/1000)) > 1) fail();
  if (typeof d.auto !== 'boolean' || !Number.isInteger(d.plays) || d.plays < 0 || d.plays > schema.TEST.maxPlays) fail();
  if (!['ru','en'].includes(d.lang) || typeof d.ua !== 'string' || d.ua.length > 200) fail();
  if (!object(d.answers) || Object.keys(d.answers).length !== Object.keys(schema.Q).length) fail();
  for (const [n,a] of Object.entries(d.answers)) {
    if (!Object.hasOwn(schema.Q,n)) fail();
    const q = schema.Q[n];
    if (a === '') continue; // unanswered questions, exactly as sent by the HTML
    if (q.type === 'match') {
      if (!object(a) || Object.keys(a).some(k => !letters.slice(0,q.left.length).includes(k)) || Object.values(a).some(v=>typeof v !== 'string' || !q.right[Number(v)-1] || String(Number(v)) !== v) || new Set(Object.values(a)).size !== Object.values(a).length) fail();
    } else if (['two','multi','gap2'].includes(q.type)) {
      if (!Array.isArray(a) || a.length > (q.type==='gap2'||q.type==='two'?2:q.o.length)) fail();
      if (q.type === 'gap2') { if(a.some(v=>typeof v!=='string'||v.length>40)) fail(); }
      else if (new Set(a).size!==a.length || a.some(v=>!letters.slice(0,q.o.length).includes(v))) fail();
    } else if (q.type === 'gap') { if(typeof a!=='string'||a.length>40) fail(); }
    else if (!letters.slice(0,q.o.length).includes(a)) fail();
  }
  return d; // Do not normalize or flatten the submitted answers.
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (object(value)) return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));
  return value;
}
export const payloadHash = payload => createHash('sha256').update(JSON.stringify(canonical(payload))).digest('hex');
