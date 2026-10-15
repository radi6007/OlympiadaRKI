import http from 'node:http';
import { validate, RequestError } from './validation.js';
import { saveAttempt } from './db.js';
export function createApi(pool,scoring,worker) {
  return http.createServer(async(req,res)=>{
    const json=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value))};
    try {
      if(req.url==='/api/health'&&req.method==='GET') {await pool.query('SELECT 1');json(200,{ok:true});return}
      if(req.url!=='/api/attempts'||req.method!=='POST'){json(404,{ok:false,error:'Not found'});return}
      if(req.headers['sec-fetch-site']==='cross-site')throw new RequestError('Cross-site request denied',403);
      if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))throw new RequestError('JSON required',415);
      const chunks=[];let length=0;
      for await(const chunk of req){length+=chunk.length;if(length>65536)throw new RequestError('Payload too large',413);chunks.push(chunk)}
      let data;try{data=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{throw new RequestError('Invalid JSON')}
      const result=await saveAttempt(pool,scoring,validate(data));
      json(200,result); // Only after the MySQL commit; never return grade/answers.
      worker?.wake();
    }catch(err){
      if(err instanceof RequestError)json(err.status,{ok:false,error:err.message});
      else {console.error('Attempt persistence unavailable:',err.code||err.name);json(503,{ok:false,error:'Result not confirmed. Retry with the same attempt ID.'})}
    }
  });
}
