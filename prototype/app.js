const L={puzzle:"загадка",diamond:"алмаз",star:"звезда",weak:"слабый",core:"ядро",ic:"сильный IC",out:"на выход",steady:"стабильный",expert:"эксперт"};
const G=[["puzzle","diamond","star"],["weak","core","ic"],["out","steady","expert"]];
function boxOf(perf,pot){
  const m={high:{high:"star",medium:"ic",low:"expert"},medium:{high:"diamond",medium:"core",low:"steady"},low:{high:"puzzle",medium:"weak",low:"out"}};
  return (m[pot]&&m[pot][perf])||"core";
}
function toP(list){
  const o={};
  list.forEach(p=>{
    const fb=(p.client_feedback&&p.client_feedback[0])||{};
    o[p.id]={n:p.name,t:p.title||p.level,b:boxOf(p.performance,p.potential),w:p.notes||(fb.score?("client "+fb.score):""),level:p.level,track:p.track,raw:p};
  });
  return o;
}
const FALLBACK=[
  {id:"demo-inc",name:"Pavel Orlov",title:"Delivery Partner",level:"partner",track:"delivery",performance:"medium",potential:"medium",notes:"Incumbent Nordics"},
  {id:"demo-star",name:"Maria Iyer",title:"Delivery Lead",level:"lead",track:"delivery",performance:"high",potential:"high",notes:"client 4.8"},
  {id:"demo-expert",name:"Dmitry Volkov",title:"Principal Engineer",level:"principal",track:"architecture",performance:"high",potential:"low",notes:"IC"},
  {id:"demo-diamond",name:"Ananya Reddy",title:"Tech Lead",level:"lead",track:"backend",performance:"medium",potential:"high",notes:"P&L"},
  {id:"demo-split",name:"Kirill Novikov",title:"Delivery Lead",level:"lead",track:"delivery",performance:"high",potential:"high",notes:"Healthcare"},
  {id:"demo-hinc",name:"Elena Sokolova",title:"Delivery Partner",level:"partner",track:"delivery",performance:"high",potential:"low",notes:"Healthcare incumbent"}
];
let P=toP(FALLBACK);
let S={role:"head",page:"p",m:"9",cand:"demo-star",pick:null,modal:null,person:null,q:"",roles:[
{id:"n",name:"DP — Nordics",inc:"demo-inc",pl:[],rec:["demo-star","demo-diamond","demo-expert","demo-split"],em:null,hz:{},dis:[],goals:{"demo-star":[{t:"QBR без партнёра",due:"2026-10-15",s:"open",by:"head"}]},notes:{}},
{id:"h",name:"DP — Healthcare",inc:"demo-hinc",pl:[{id:"demo-split",k:"primary"}],rec:[],em:null,hz:{"demo-split":"6m"},dis:[],goals:{"demo-split":[{t:"Shadow QBR",due:"2026-10-30",s:"open",by:"head"}]},notes:{}}
]};
const C={head:{sl:1,ed:1,hz:1,go:1,box:0,cm:1},hr:{sl:0,ed:0,hz:0,go:0,box:1,cm:1},observer:{sl:0,ed:0,hz:0,go:0,box:0,cm:0},candidate:{sl:0,ed:0,hz:0,go:1,box:0,cm:0}};
const R=id=>S.roles.find(r=>r.id===id);
function rn(r){return r.pl.some(x=>(r.hz[x.id]||"")==="ready_now")}
function gs(r,id){r.goals[id]=r.goals[id]||[];return r.goals[id]}
function notes(r,id){r.notes=r.notes||{};r.notes[id]=r.notes[id]||[];return r.notes[id]}
function ids(){return Object.keys(P)}
function hdr(){
 document.body.className=S.role;
 document.getElementById("nav").innerHTML=S.role==="candidate"?"":`<button class="${S.page==="p"?"on":""}" onclick="S.page='p';draw()">Pipeline</button><button class="${S.page==="x"?"on":""}" onclick="S.page='x';draw()">Матрица</button>`;
 document.getElementById("sw").innerHTML=["observer","head","hr","candidate"].map(k=>`<button class="${S.role===k?"on":""}" onclick="S.role='${k}';S.modal=S.pick=S.person=null;draw()">${k}</button>`).join("")
 +(S.role==="candidate"?`<select onchange="S.cand=this.value;draw()">${ids().map(id=>`<option value="${id}" ${id===S.cand?"selected":""}>${P[id].n}</option>`).join("")}</select>`:"");
 const a=S.roles.filter(r=>!rn(r)).length,b=S.roles.filter(r=>!r.pl.length).length,c=S.roles.filter(r=>!r.em).length;
 document.getElementById("cnt").textContent=S.role==="candidate"?"":`нет ready-now ${a} · без planned ${b} · нет cover ${c} · пул ${ids().length}`;
}
function addP(rid,pid){const r=R(rid);if(!P[pid])return;if(r.pl.some(x=>x.id===pid))return;r.pl.push({id:pid,k:"backup"});r.rec=r.rec.filter(i=>i!==pid);if(!r.hz[pid])r.hz[pid]="12m";draw()}
function remP(rid,pid){const r=R(rid);r.pl=r.pl.filter(x=>x.id!==pid);delete r.hz[pid];if(!r.dis.includes(pid)&&!r.rec.includes(pid))r.rec.push(pid);draw()}
function remE(rid,pid){const r=R(rid);r.rec=r.rec.filter(i=>i!==pid);if(!r.dis.includes(pid))r.dis.push(pid);draw()}
function hz(rid,pid,v){const r=R(rid);r.hz[pid]=(v==="ready_now"&&r.hz[pid]==="ready_now")?"6m":v;draw()}
function togG(rid,pid,i){const g=gs(R(rid),pid)[i];g.s=g.s==="done"?"open":"done";draw()}
function addCmt(){const el=document.getElementById("cmt");const t=(el&&el.value||"").trim();if(!t||!S.person)return;notes(R(S.person.rid),S.person.id).push({text:t,by:S.role,at:new Date().toISOString()});draw()}
function row(id,r,actions){
  if(!P[id])return"";
  return `<div class="slate-item"><div class="row"><b onclick="openP('${id}','${r.id}')">${P[id].n}</b><span class="chip ${(r.hz[id]||"")==="ready_now"?"ok":""}">${r.hz[id]||"—"}</span></div>
  <div class="why">${P[id].t} · ${L[P[id].b]||P[id].b} · ${P[id].w||""}</div>${actions||""}</div>`;
}
function btnsP(r,id){return `<div class="acts">${["ready_now","6m","12m","18m"].map(h=>`<button onclick="hz('${r.id}','${id}','${h}')">${h}</button>`).join("")}<button onclick="remP('${r.id}','${id}')">−</button></div>`}
function btnsR(r,id){return `<div class="acts"><button class="acc" onclick="addP('${r.id}','${id}')">в planned</button><button onclick="R('${r.id}').em='${id}';draw()">emergency</button>${["6m","12m","18m"].map(h=>`<button onclick="hz('${r.id}','${id}','${h}')">${h}</button>`).join("")}<button onclick="remE('${r.id}','${id}')">−</button></div>`}
function pipe(){const sl=C[S.role].sl;return `<div class="grid">${S.roles.map(r=>`<article class="card ${rn(r)?"":"risk"}"><div class="row"><h3>${r.name}</h3>${C[S.role].ed?`<button onclick="S.modal={t:'role',id:'${r.id}'};draw()">редактировать</button>`:""}</div>
 <div class="why">inc ${P[r.inc]?P[r.inc].n:r.inc} · ${rn(r)?"ready-now":"нет ready-now"}</div>
 <p class="sec">PLANNED</p>${r.pl.map(x=>row(x.id,r,sl?btnsP(r,x.id):"")).join("")||"<div class='why'>пусто</div>"}
 <p class="sec">RECOMMENDED</p>${r.rec.map(id=>row(id,r,sl?btnsR(r,id):"")).join("")||"<div class='why'>пусто</div>"}
 ${sl?`<p class="acts"><button onclick="S.modal={t:'pool',rid:'${r.id}'};S.q='';draw()">+ из пула</button></p>`:""}
 <div class="why">Emergency: ${r.em&&P[r.em]?P[r.em].n:"—"} ${r.em&&sl?`<button onclick="R('${r.id}').em=null;draw()">снять</button>`:""}</div>
 </article>`).join("")}</div>`+(C[S.role].ed?`<p style="margin-top:16px"><button class="acc" onclick="S.modal={t:'role'};draw()">Новая роль</button></p>`:"");}
function nine(){const seen=new Set();S.roles.forEach(r=>{[r.inc,...r.pl.map(x=>x.id),...r.rec,r.em].forEach(i=>i&&P[i]&&seen.add(i))});const by={};[...seen].forEach(id=>{(by[P[id].b]=by[P[id].b]||[]).push(id)});const box=C[S.role].box;
 let h=`<div class="how">9-box не оценка «хороший/плохой». Звезда/алмаз — planned. Эксперт — не partner. Клетка ≠ дата. ${box?"HR: клик → 9 клеток + коммент.":"Просмотр."} <button onclick="S.m='9';draw()">9-box</button> <button onclick="S.m='t';draw()">Таймлайн</button></div><div class="nine"><div></div><div class="why">low perf</div><div class="why">med</div><div class="why">high</div>`;
 [["hi pot",G[0]],["mid",G[1]],["lo pot",G[2]]].forEach(([lab,row])=>{h+=`<div class="why">${lab}</div>`;row.forEach(b=>{h+=`<div class="cell"><div class="why">${L[b]}</div>${(by[b]||[]).map(id=>`<button onclick="${box?`S.pick='${id}';draw()`:`openP('${id}')`}">${P[id].n}</button>`).join("")}</div>`})});
 return h+"</div>"+(S.pick&&box?`<div class="modal"><div class="box"><h3>${P[S.pick].n}</h3>${Object.keys(L).map(k=>`<label><input type="radio" name="bx" value="${k}" ${P[S.pick].b===k?"checked":""}/> ${L[k]}</label>`).join("")}<textarea id="note" placeholder="почему клетка"></textarea><button onclick="S.pick=null;draw()">отмена</button><button class="acc" onclick="svBox()">ок</button></div></div>`:"");}
function svBox(){const n=document.getElementById("note").value.trim();if(!n){alert("нужен комментарий");return;}P[S.pick].b=[...document.querySelectorAll("[name=bx]")].find(i=>i.checked).value;const role=S.roles.find(r=>r.pl.some(x=>x.id===S.pick)||r.rec.includes(S.pick)||r.inc===S.pick)||S.roles[0];if(role)notes(role,S.pick).push({text:"9-box: "+n,by:"hr",at:new Date().toISOString()});S.pick=null;draw()}
function time(){const cols=["ready_now","6m","12m","18m"];let h=`<div class="how"><button onclick="S.m='9';draw()">9-box</button> Таймлайн: жирный = planned</div><table><tr><th>роль</th>${cols.map(c=>`<th>${c}</th>`).join("")}</tr>`;
 S.roles.forEach(r=>{h+=`<tr><td>${r.name}${rn(r)?"":" ✗"}</td>`;cols.forEach(c=>{const a=r.pl.filter(x=>(r.hz[x.id]||"")===c).map(x=>P[x.id]?"<b>"+P[x.id].n+"</b>":"");const b=r.rec.filter(id=>(r.hz[id]||"")===c).map(id=>P[id]?P[id].n:"");h+=`<td>${[...a,...b].filter(Boolean).join("<br>")||"—"}</td>`});h+="</tr>"});return h+"</table>"}
function goalRow(r,id,x,i,canDel){
  const tog=`<button onclick="togG('${r.id}','${id}',${i})">${x.s==="done"?"не выполнено":"выполнено"}</button>`;
  const del=canDel?`<button onclick="gs(R('${r.id}'),'${id}').splice(${i},1);draw()">удалить</button>`:"";
  return `<div class="slate-item">${x.t} · ${x.due||"без даты"} · ${x.s} ${tog} ${del}</div>`;
}
function mine(){const id=S.cand;if(!P[id])return"<p class='how'>нет профиля</p>";const rs=S.roles.filter(r=>r.pl.some(x=>x.id===id)||r.rec.includes(id));
 return `<p class="how">Кабинет кандидата. Только свои роли.</p><h2>${P[id].n}</h2><div class="grid">${rs.map(r=>{const g=gs(r,id);return `<article class="card"><h3>${r.name}</h3><span class="chip">${r.pl.some(x=>x.id===id)?"planned":"recommended"}</span> <span class="chip">${r.hz[id]||"—"}</span>${g.map((x,i)=>goalRow(r,id,x,i,false)).join("")}<button class="acc" onclick="S.modal={t:'goal',rid:'${r.id}',pid:'${id}'};draw()">+ цель</button></article>`}).join("")||"<p class='why'>нет ролей</p>"}</div>`}
function openP(id,rid){S.person={id,rid};draw()}
function card(){if(!S.person||S.role==="candidate"||!P[S.person.id])return"";const p=P[S.person.id],r=R(S.person.rid)||S.roles[0],g=gs(r,S.person.id),nt=notes(r,S.person.id);
 const see=S.role!=="candidate";
 return `<div class="modal" onclick="if(event.target===this){S.person=null;draw()}"><div class="box"><button onclick="S.person=null;draw()">закрыть</button><h3>${p.n}</h3><div class="why">${r.name} · ${p.t} · ${L[p.b]}</div>
 ${g.map((x,i)=>goalRow(r,S.person.id,x,i,S.role==="head")).join("")}
 ${C[S.role].go?`<button class="acc" onclick="S.modal={t:'goal',rid:'${r.id}',pid:'${S.person.id}'};draw()">+ цель</button>`:""}
 ${C[S.role].hz?["ready_now","6m","12m","18m"].map(h=>`<button onclick="hz('${r.id}','${S.person.id}','${h}')">${h}</button>`).join(""):""}
 ${see?`<p class="sec">Комментарии</p>${nt.map(c=>`<div class="slate-item">${c.by} · ${(c.at||"").slice(0,16)} · ${c.text}</div>`).join("")||"<div class='why'>пока нет</div>"}`:""}
 ${C[S.role].cm?`<textarea id="cmt" placeholder="комментарий"></textarea><button class="acc" onclick="addCmt()">добавить</button>`:""}
 </div></div>`}
function poolOpts(rid){
  const r=R(rid),used=new Set([r.inc,...r.pl.map(x=>x.id),...r.rec]);
  const q=(S.q||"").toLowerCase();
  return ids().filter(id=>!used.has(id)).filter(id=>{
    const p=P[id];const blob=(p.n+" "+(p.t||"")+" "+id+" "+(p.level||"")+" "+(p.track||"")).toLowerCase();
    return !q||blob.includes(q);
  });
}
function mods(){if(!S.modal)return"";
 if(S.modal.t==="goal"){const g=S.modal.i!=null?gs(R(S.modal.rid),S.modal.pid)[S.modal.i]:null;return `<div class="modal"><div class="box"><h3>Цель</h3><input id="gt" value="${g?g.t:""}"/><input id="gd" type="date" value="${g?g.due:""}"/><button onclick="S.modal=null;draw()">нет</button><button class="acc" onclick="svG()">ок</button></div></div>`}
 if(S.modal.t==="pool"){const opts=poolOpts(S.modal.rid);return `<div class="modal"><div class="box"><h3>В recommended · пул ${ids().length}</h3><input id="pq" placeholder="имя / title / id / level / track" value="${S.q||""}" oninput="S.q=this.value;draw()"/><select id="pool" size="8">${opts.map(id=>`<option value="${id}">${P[id].n} — ${P[id].t}</option>`).join("")}</select><p class="why">${opts.length?opts.length+" чел.":"никого"}</p><button onclick="S.modal=null;draw()">нет</button><button class="acc" onclick="addFromPool()">ок</button></div></div>`}
 if(S.modal.t==="role"){const r=S.modal.id?R(S.modal.id):null;return `<div class="modal"><div class="box"><h3>${r?"Редакт":"Новая"} роль</h3><input id="rn" value="${r?r.name:""}"/><select id="ri">${ids().map(id=>`<option value="${id}" ${r&&r.inc===id?"selected":""}>${P[id].n} — ${P[id].t}</option>`).join("")}</select><button onclick="S.modal=null;draw()">нет</button><button class="acc" onclick="svR()">ок</button></div></div>`}
 return""}
function addFromPool(){const r=R(S.modal.rid),sel=document.getElementById("pool"),id=sel&&sel.value;if(id&&!r.rec.includes(id)&&r.inc!==id){r.dis=r.dis.filter(i=>i!==id);r.rec.push(id)}S.modal=null;draw()}
function svG(){const t=gt.value.trim(),d=gd.value,m=S.modal;if(m.i!=null){const g=gs(R(m.rid),m.pid)[m.i];g.t=t||g.t;g.due=d}else gs(R(m.rid),m.pid).push({t:t||"Цель",due:d,s:"open",by:S.role});S.modal=null;draw()}
function svR(){const name=rn.value||"Роль",inc=ri.value;if(S.modal.id){const r=R(S.modal.id);r.name=name;r.inc=inc;r.pl=r.pl.filter(x=>x.id!==inc);r.rec=r.rec.filter(i=>i!==inc)}else S.roles.unshift({id:"r"+Date.now(),name,inc,pl:[],rec:[],em:null,hz:{},dis:[],goals:{},notes:{}});S.modal=null;draw()}
function scrub(){S.roles.forEach(r=>{r.pl=r.pl.filter(x=>P[x.id]);r.rec=r.rec.filter(id=>P[id]);if(r.em&&!P[r.em])r.em=null;if(!P[r.inc]&&ids()[0])r.inc=ids()[0];});if(!P[S.cand])S.cand=ids()[0]}
function draw(){hdr();document.getElementById("app").innerHTML=(S.role==="candidate"?mine():S.page==="p"?pipe():S.m==="t"?time():nine())+card()+mods()}
async function boot(){
  try{
    const res=await fetch("people.json",{cache:"no-store"});
    if(res.ok){
      const data=await res.json();
      const list=Array.isArray(data)?data:(data.people||[]);
      if(list.length){P=toP(list);scrub()}
    }
  }catch(e){}
  draw();
}
boot();
