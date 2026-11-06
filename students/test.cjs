const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const key='packliste_sudafrica_2026_v4_students';
function run(saved,mutate){
 const nodes=new Map(),storage=new Map(saved?[[key,saved]]:[]);
 function node(id){if(!nodes.has(id)) nodes.set(id,{value:'',style:{},dataset:{},options:[],hidden:true,classList:{toggle(){},add(){},remove(){}},setAttribute(){},querySelectorAll(){return[];},addEventListener(){},textContent:'',innerHTML:''});return nodes.get(id);}
 const ctx={window:{addEventListener(){}},document:{getElementById:node,documentElement:{},querySelectorAll(){return[];},addEventListener(){},body:{insertAdjacentHTML(){}}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},console:{warn(){},info(){}},navigator:{},location:{},fetch:async()=>{throw Error('offline')},setTimeout(){},clearTimeout(){},requestAnimationFrame(){}};
 vm.createContext(ctx);scripts.slice(0,-1).forEach(s=>vm.runInContext(s,ctx));
 if(mutate)mutate(ctx.window);
 vm.runInContext(scripts.at(-1).replace('  applyLanguage();\n  if (canWrite)', '  window.test={state,toggleItem,save,renderList,openEditor};\n  applyLanguage();\n  if (canWrite)'),ctx);
 return {ctx,storage,nodes,state:ctx.window.test.state};
}
let first=run();assert.equal(first.state.items.length,95);assert.equal(new Set(first.state.items.map(i=>i.id)).size,95);
first.ctx.window.test.toggleItem('mare-01');
let saved=JSON.parse(first.storage.get(key));
saved.items.find(i=>i.id==='mare-01').nameOverride='Mein Bikini';
saved.items=saved.items.filter(i=>i.id!=='mare-03');
saved.items.push({id:'custom-test',category:'campus',name:'Mein Buch',note:'Persönlich',checked:true});
let updated=run(JSON.stringify(saved),w=>{w.PACKLISTE_SEED.items.push({id:'new-central',category:'campus',name:'Neuer Eintrag',note:''});});
assert.equal(updated.state.items.find(i=>i.id==='mare-01').checked,true);
assert.equal(updated.state.items.find(i=>i.id==='mare-01').nameOverride,'Mein Bikini');
assert(!updated.state.items.some(i=>i.id==='mare-03'));
assert.equal(updated.state.items.find(i=>i.id==='custom-test').checked,true);
assert.equal(updated.state.items.find(i=>i.id==='new-central').checked,false);
let again=run(updated.storage.get(key),w=>w.PACKLISTE_SEED.items.push({id:'new-central',category:'campus',name:'Neuer Eintrag',note:''}));
assert.equal(again.state.items.filter(i=>i.id==='new-central').length,1);
const corrupt=run('{broken');assert.equal(corrupt.storage.get(key),'{broken');assert.equal(corrupt.nodes.get('storageNotice').hidden,false);
assert(html.includes('id="languageSwitch" hidden'));assert(html.includes("language = 'de';"));
for(const name of ['Wandern & Berge','Strand & Meer','Campus','Krankenhaus','Mikrofaserhandtuch','Flip-Flops','Kleiner Föhn','Bikini','Sportkleidung','Vorhängeschlösser','Tourniquet','Jutebeutel','Kasacks']) assert(html.includes(name),name);
const sw=fs.readFileSync(__dirname+'/service-worker.js','utf8');new vm.Script(sw);
assert(sw.includes('sa26-students-'));assert(!sw.includes('sa26-irene-'));assert(sw.includes("endsWith('/version.json')"));
const manifest=JSON.parse(fs.readFileSync(__dirname+'/manifest.webmanifest'));assert.equal(manifest.scope,'./');
console.log('PASS: 95 unique items; central addition; checks, edits, deletions and custom entries preserved; repeated migration; corrupt storage protected; German content; isolated service worker and manifest.');
async function testWorker(){
 const listeners={},removed=[],cache=new Map([['./index.html','cached HTML']]);let online=true,responded=false;
 const context={URL,self:{location:{origin:'https://example.test'},registration:{scope:'https://example.test/students/'},addEventListener:(n,f)=>listeners[n]=f,clients:{claim:async()=>{}},skipWaiting:async()=>{}},caches:{open:async()=>({addAll:async()=>{},put:async(k,v)=>cache.set(k,v)}),match:async k=>cache.get(k),keys:async()=>['packliste-sa26-students-old','packliste-sa26-irene-v10'],delete:async k=>removed.push(k)},fetch:async()=>{if(!online)throw Error('offline');return{ok:true,clone:()=> 'fresh HTML'};}};
 vm.runInNewContext(sw,context);
 let pending;listeners.activate({waitUntil:p=>pending=p});await pending;
 assert.deepEqual(removed,['packliste-sa26-students-old']);
 async function request(path,mode){let response,work;responded=false;listeners.fetch({request:{method:'GET',url:'https://example.test/'+path,mode},respondWith:p=>{responded=true;response=p;},waitUntil:p=>work=p});const value=await response;await work;return value;}
 await request('students/','navigate');assert.equal(cache.get('./index.html'),'fresh HTML');
 online=false;assert.equal(await request('students/','navigate'),'fresh HTML');
 await request('irene/','navigate');assert.equal(responded,false);
 await assert.rejects(()=>request('students/version.json','cors'));
 console.log('PASS: worker network-first navigation, refreshed offline fallback, no interception or cache deletion for Irene, version endpoint never served stale.');
}
testWorker().catch(e=>{console.error(e);process.exitCode=1;});
