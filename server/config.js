import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
export function config(env = process.env) {
  const url = env.APPS_SCRIPT_URL || '';
  if (!url) throw new Error('APPS_SCRIPT_URL is required');
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' && !(env.ALLOW_LOCAL_SYNC === 'true' && ['127.0.0.1', 'localhost'].includes(parsed.hostname))) throw new Error('APPS_SCRIPT_URL must use HTTPS');
  for (const key of ['MYSQL_DATABASE', 'MYSQL_USER', 'SCORING_SOURCE_PATH']) if (!env[key]) throw new Error(`${key} is required`);
  return {
    host: env.API_HOST || '127.0.0.1', port: Number(env.API_PORT || 3001),
    source: resolve(env.SCORING_SOURCE_PATH), url,
    syncInterval: Number(env.SYNC_INTERVAL_MS || 15000), syncTimeout: Number(env.SYNC_TIMEOUT_MS || 45000),
    mysql: { host: env.MYSQL_HOST || '127.0.0.1', port: Number(env.MYSQL_PORT || 3306),
      user: env.MYSQL_USER, password: env.MYSQL_PASSWORD || '', database: env.MYSQL_DATABASE,
      charset: 'utf8mb4', timezone: 'Z', connectionLimit: 5, connectTimeout: 5000,
      ...(env.MYSQL_SSL_CA ? {ssl: {ca: readFileSync(env.MYSQL_SSL_CA), rejectUnauthorized: true}} : {}) },
  };
}
