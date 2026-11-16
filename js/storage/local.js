import {recommended} from '../effects/catalog.js';
export const defaults={name:'La noche es nuestra',theme:'fiesta',color:'#bdff41',secondary:'#e76bfa',text:'Cuatro momentos. Una gran historia.',layout:'grid',date:true,sound:true,returnSeconds:45,quality:.94,enabled:recommended('fiesta'),logo:null};
let dbPromise;
function db(){return dbPromise??=new Promise((resolve,reject)=>{const r=indexedDB.open('horaloca',1);r.onupgradeneeded=()=>{r.result.createObjectStore('settings');r.result.createObjectStore('sessions',{keyPath:'id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function loadConfig(){const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction('settings').objectStore('settings').get('event');r.onsuccess=()=>resolve({...defaults,...r.result});r.onerror=()=>reject(r.error);});}
export async function saveConfig(config){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('settings','readwrite');t.objectStore('settings').put(config,'event');t.oncomplete=resolve;t.onerror=()=>reject(t.error);});}
export async function saveSession(blob,meta){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('sessions','readwrite'),s=t.objectStore('sessions');s.put({id:crypto.randomUUID(),created:Date.now(),blob,...meta});const r=s.getAll();r.onsuccess=()=>{const oldest=r.result.sort((a,b)=>a.created-b.created);for(const entry of oldest.slice(0,Math.max(0,oldest.length-12)))s.delete(entry.id);};t.oncomplete=resolve;t.onerror=()=>reject(t.error);});}
// Future synchronization is deliberately disconnected from the camera engine.
export class LocalLicenseProvider {async check(){return {mode:'local',allowed:true};}}
export class NoSyncAdapter {async enqueue(){return {state:'local-only'};}}
