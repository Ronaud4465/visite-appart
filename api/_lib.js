import { createClient } from '@supabase/supabase-js';
import { serialize, parse } from 'cookie';
import crypto from 'crypto';
export function supabaseAdmin(){const url=process.env.SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('Missing Supabase env');return createClient(url,key);}
function secret(){return process.env.SESSION_SECRET||'CHANGE_ME_DEV_SECRET'}
export function sign(value){return crypto.createHmac('sha256',secret()).update(value).digest('hex')}
export function createSessionCookie(){const value='admin';const token=`${value}.${sign(value)}`;return serialize('admin_session',token,{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:60*60*8});}
export function clearSessionCookie(){return serialize('admin_session','',{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:0});}
export function isAdmin(req){const cookies=parse(req.headers.cookie||'');const token=cookies.admin_session||'';const [value,signature]=token.split('.');return value==='admin'&&signature===sign(value);}
export function json(res,status,body,extraHeaders={}){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');for(const [k,v] of Object.entries(extraHeaders))res.setHeader(k,v);res.end(JSON.stringify(body));}
