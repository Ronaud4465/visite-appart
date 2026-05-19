import { supabaseAdmin, json } from './_lib.js';
const DEF={datesA:[],datesB:[],datesW:[],weekendActive:false,aStart:'09:00',aEnd:'12:00',bStart:'14:00',bEnd:'17:00',keywordsA:[],keywordsB:[]};
export default async function handler(req,res){const db=supabaseAdmin();const {data}=await db.from('app_config').select('value').eq('key','main').single();return json(res,200,data?.value||DEF);}
