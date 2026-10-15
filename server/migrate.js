import { readFileSync } from 'node:fs';
import { config } from './config.js';
import { createPool } from './db.js';
const pool=createPool(config());
try{await pool.query(readFileSync(new URL('./migrations/001_attempts.sql',import.meta.url),'utf8'));console.log('Migration 001 applied')}finally{await pool.end()}
