import { DEMO } from "./tests/mode.js";
import D from "./content.json";
import "./fonts.css";
import "./design-tokens.css";
import { icon } from "./icons.js";
import { organizationSites } from "./organizations.js";
import { privacyLabels, privacyLink, privacyDocument } from "./privacy.js";
import "./layout.css";
import "./product.css";
function readLanguage(){try{return localStorage.getItem("olympiad-language")==="en"?"en":"ru"}catch{return "ru"}}
const S = {page: location.pathname.split("/")[1] || "landing", lang: readLanguage()};
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const fill = (s, st) => s.replace(/\{code\}/g, st.code).replace(/\{age\}/g, st.age);

function header(t){
  return `<header class="top">
    <a href="${organizationSites.ipr}" class="home-brand organization-link" target="_blank" rel="noopener noreferrer"><img class="brandlogo" src="/assets/72c87ae288b5.png" alt="IPR РКИ"></a>
    <span class="header-title">${esc(t.ui.olympiad)}</span>
    <div class="spacer"></div>
    <div class="lsw">${D.LANGS.map(l=>`<button data-l="${l.id}" aria-pressed="${S.lang===l.id}" class="${S.lang===l.id?"on":""}">${l.label}</button>`).join("")}</div>
  </header><nav class="breadcrumb"><a href="/">${S.lang==="ru"?"Олимпиада":"Olympiad"}</a>${S.page!=="landing"?"<span> / "+(S.page==='data-processing'?esc(privacyLabels[S.lang]):S.page.toUpperCase().replace("RKI","РКИ").replace("RKU","РКУ"))+"</span>":""}</nav>`;
}
function footer(T){
  const L=T.landing;
  return `<footer class="foot"><div class="wrap">
    <div><h3>${esc(L.contactsTitle)}</h3>
      <p>${esc(L.contactName)}</p>
      <p class="ltr">${esc(D.PHONE)} · ${esc(D.EMAIL)}</p>
    </div>
    <div class="motto">${esc(L.motto)}</div>
  </div><div class="wrap footer-legal">${privacyLink(S.lang)}</div></footer>`;
}
function privacyPage(T){
  return header(T)+`<div class="wrap"><aside class="privacy-demo-note" ${DEMO ? '' : 'hidden'}>${S.lang==='ru'?'Сейчас открыт локальный демопрототип: данные и ответы остаются в браузере, отправки и записи в базу нет. Документ ниже описывает обработку данных при подключении серверного сохранения.':'This is a local demo: details and answers stay in the browser; no results are sent or saved to a database. The Russian document below describes data processing when server storage is connected.'}</aside><article class="privacy-document" lang="ru">${privacyDocument()}</article></div>`+footer(T);
}
function landing(T){
  const L=T.landing, U=T.ui;
  const tracks = ["rku","rki"].map(tr=>`
    <div class="track ${tr}">
      <span class="tag">${tr==="rku"?"РКУ":"РКИ"}</span>
      <h3>${esc(L[tr].name)}</h3>
      <p>${esc(L[tr].text)}</p>
      <div class="streams">${D.STREAMS.filter(s=>s.track===tr).map(s=>`<a class="stream" href="/${s.slug}"><b>${s.code} ${icon("external")}</b><span>${tr==="rku"?s.age+" "+esc(U.years):esc(s.level[S.lang])}</span></a>`).join("")}</div>
    </div>`).join("");
  return header(T)+`
  <div class="hero"><div class="wrap">
    <div>
      <div class="kicker">${esc(L.kicker)}</div>
      <h1>«${esc(U.title)}»</h1>
      ${(L.leadParas||[L.lead]).map((x,i)=>`<p class="lead${i===0?" q1":""}">${esc(x)}</p>`).join("")}
      <p class="year">${esc(L.year)}</p>
      <ul class="chips">${L.chips.map(c=>`<li>${esc(c)}</li>`).join("")}</ul>
      <div class="btns">
        <a class="btn primary" href="${D.REG_URL}" target="_blank" rel="noopener">${esc(L.ctaReg)}<small>${esc(L.ctaRegNote)}</small></a>
      </div>
    </div>
    <div class="hero-media">
      <div class="hero-photo"><img src="/assets/7adbd42674db.webp" alt=""></div>
    </div>
  </div></div>

  <section><div class="wrap">
    <h2>${esc(L.datesTitle)}</h2>
    <ol class="timeline">${L.dates.map((d,i)=>`<li class="${i===0?"now":""}"><span class="d">${esc(d[0])}</span><span class="n">${esc(d[1])}</span>${d[2]?`<span class="s">${esc(d[2])}</span>`:""}</li>`).join("")}</ol>
  </div></section>

  <section class="alt"><div class="wrap">
    <h2>${esc(L.tracksTitle)}</h2>
    <div class="tracks">${tracks}</div>
    <div class="hint"><span class="q">${icon("info")}</span><p style="margin:0">${esc(L.hint)}</p></div>
  </div></section>

  <section><div class="wrap">
    <h2>${esc(L.format.title)}</h2>
    <div class="fmt">
      <div>
        <p class="lead">${esc(L.format.lead)}</p>
        <ol class="parts">${L.format.parts.map((x,i)=>`<li><span>0${i+1}</span><b>${esc(x)}</b></li>`).join("")}</ol>
        <div class="fmt-note">${icon("headphones")}${esc(L.format.note)}</div>
      </div>
      <div class="types"><h3>${esc(L.format.typesTitle)}</h3><ul>${L.format.types.map((x,i)=>`<li><i>${(S.lang==="ru"?["А)","Б)","В)","Г)"]:["A)","B)","C)","D)"])[i]}</i><span>${esc(x)}</span></li>`).join("")}</ul></div>
    </div>
  </div></section>

  <section style="padding-top:0"><div class="wrap">
    <h2>${esc(L.stepsTitle)}</h2>
    <ol class="steps">${L.steps.map(s=>`<li><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></li>`).join("")}</ol>
  </div></section>

  <section style="padding-top:0"><div class="wrap">
    <h2>${esc(L.awardsTitle)}</h2>
    <div class="awards">${L.awards.map((a,i)=>`<div class="award"><div class="ic">${icon(["medal","cert","mail"][i])}</div><b>${esc(a[0])}</b><span>${esc(a[1])}</span></div>`).join("")}</div>
  </div></section>

  <section class="alt"><div class="wrap">
    <h2>${esc(L.faqTitle)}</h2>
    <div class="faq">${L.faq.map(f=>`<div><b>${esc(f[0])}</b><p>${esc(f[1])}</p></div>`).join("")}</div>
    <div class="btns" style="margin-top:22px"><a class="btn primary" href="${D.REG_URL}" target="_blank" rel="noopener">${esc(L.ctaReg)}<small>${esc(L.ctaRegNote)}</small></a></div>
  </div></section>

  <section><div class="wrap">
    <div class="partners">
      <div class="lbl">${esc(L.orgTitle)}</div>
      <div class="prow">${L.orgs.map((o,i)=>`<a class="pcard organization-link" href="${[organizationSites.chspu,organizationSites.ksors][i]}" target="_blank" rel="noopener noreferrer">${esc(o)}</a>`).join("")}</div>
      <div class="lbl">${esc(L.supportTitle)}</div>
      <div class="prow">${L.support.map((o,i)=>`<a class="pcard organization-link" href="${[organizationSites.ministry,organizationSites.embassy,organizationSites.consulate,organizationSites.mapryal][i]}" target="_blank" rel="noopener noreferrer"><img class="plogo" src="${["/assets/0602328aee45.png","/assets/619bf80f2146.png","/assets/018c37bc6e2b.png","/assets/66f62db6817d.png"][i]}" alt="">${esc(o)}</a>`).join("")}</div>
      <div class="lbl">${esc(L.partnerTitle)}</div>
      <div class="prow"><a class="pcard organization-link" href="${organizationSites.ipr}" target="_blank" rel="noopener noreferrer"><img class="brandlogo" src="/assets/72c87ae288b5.png" alt="IPR РКИ"></a></div>
    </div>
  </div></section>
  `+footer(T);
}

function fmtBlock(T,tr,st){
  const F=T.landing.format, X=T.test;
  return `<p style="margin:0 0 14px">${esc(F.lead)}</p>
    <ol class="parts">${F.parts.map((x,i)=>`<li><span>0${i+1}</span><b>${esc(x)}</b></li>`).join("")}</ol>
    <div class="types" style="margin-top:14px"><h3>${esc(F.typesTitle)}</h3><ul>${F.types.map((x,i)=>`<li><i>${(S.lang==="ru"?["А)","Б)","В)","Г)"]:["A)","B)","C)","D)"])[i]}</i><span>${esc(x)}</span></li>`).join("")}</ul></div>
    <div class="total" style="margin-top:16px;font-size:18px">${esc(X.maxScore)}</div>`;
}
function testPage(st, T){
  const X=T.test, U=T.ui, L=T.landing, tr=st.track;
  const lvl = st.level[S.lang];
  return header(T)+`
  <div class="thero ${tr}"><div class="wrap">
    <div class="kicker">${esc(X.eyebrow)}</div>
    <div class="code-badge"><b>${st.code}</b></div>
    <h1>${esc(U.olympiad)} «${esc(U.title)}»</h1>
    <p class="sub">${esc(U.tracks[tr])} · ${tr==="rku"?st.age+" "+esc(U.years)+" · ":""}${esc(lvl)}</p>
    <div class="facts">${X.facts.map((f,i)=>`<div class="fact ${i===1?"once":""}"><b>${esc(f[0])}</b><span>${esc(f[1])}</span></div>`).join("")}</div>
  </div></div>

  <div class="wrap"><div class="imp">
    <div class="imp-h"><span>${icon("info")}</span>${esc(X.importantTitle)}</div>
    <ul>
      ${tr==="rki"?`<li>${icon("chat")}<span>${esc(X.langNote)}</span></li>`:""}
      <li>${icon("headphones")}<span>${esc(T.landing.format.note)}</span></li>
      <li>${icon("keyboard")}<span>${esc(X.keyboard)}</span></li>
    </ul>
  </div>
  </div>

  <section style="padding-top:40px"><div class="wrap grid2">
    <div>
      <h2>${esc(X.whoTitle)}</h2>
      <p style="margin-top:0">${esc(tr==="rku"?X.whoRku:X.whoRki)}</p>
      <p><b>${tr==="rku"?esc(fill(X.whoAge,st)):esc(lvl)}</b></p>
    </div>
    <div>
      <h2>${esc(X.whyTitle)}</h2>
      <ul class="list">${X.why.map(w=>`<li>${esc(fill(w,st))}</li>`).join("")}</ul>
    </div>
  </div></section>

  <section class="alt"><div class="wrap test-format ${tr}">
    <div>
      <h2>${esc(X.whatTitle)}</h2>
      ${fmtBlock(T,tr,st)}
    </div>
    <div>
      <h2>${esc(X.howTitle)}</h2>
      <ol class="howsteps">${X.how.map(h=>`<li><b>${esc(h[0])}</b><p>${esc(fill(h[1],st))}</p></li>`).join("")}</ol>
    </div>
  </div></section>

  <section><div class="wrap">
    <div class="callouts">
      <div class="callout once"><div class="big">1</div><h3>${esc(X.onceTitle)}</h3><p>${esc(X.once)}</p></div>
      <div class="callout data"><h3>${esc(X.dataTitle)}</h3><p>${esc(X.dataLead)}</p><ol>${X.data.map(d=>`<li>${esc(fill(d,st))}</li>`).join("")}</ol></div>
    </div>
  </div></section>

  <section style="padding-top:0"><div class="wrap rules">
    <div class="panel"><h3>${esc(X.rulesTitle)}</h3><p>${esc(X.rulesLead)}</p><ul class="list x">${X.rules.map(r=>`<li>${esc(r)}</li>`).join("")}</ul><p class="small" style="margin:14px 0 0">${esc(X.rulesNote)}</p></div>
    <div class="panel"><h3>${esc(X.techTitle)}</h3><p>${esc(fill(X.tech,st))}</p><p class="mail">${esc(D.EMAIL)}</p></div>
  </div></section>

  <section style="padding-top:0"><div class="wrap">
    <div class="cta-box">
      ${st.testPath ? `<div><label><input type="checkbox" id="agree"> ${esc(X.ctaCheck)}</label><p class="small">${DEMO ? (S.lang==='ru'?'Локальный деморежим. Ответы не отправляются организаторам.':'Local demo. Answers are not sent to the organisers.') : (S.lang==='ru'?'Дождитесь подтверждения сохранения ответов после завершения теста.':'Wait for confirmation that your answers are saved after finishing the test.')}</p></div><button class="btn primary" id="startBtn" disabled>${esc(X.cta)} · ${st.code}</button>` : `<div role="status"><h3>${S.lang==='ru'?'Тест пока недоступен':'Test not yet available'}</h3><p>${S.lang==='ru'?'Задания этого направления ещё не подключены. Организаторы сообщат, когда можно будет начать.':'The tasks for this stream are not yet available. The organisers will let you know when you can start.'}</p></div>`}
    </div>
  </div></section>
  `+footer(T);
}


function render(){
 const T=D.T[S.lang], st=D.STREAMS.find(x=>x.slug===S.page);
 document.documentElement.lang=S.lang;
 document.title=(S.page==='data-processing'?privacyLabels[S.lang]+' · ':st?st.code+' · ':'')+T.ui.title;
 document.getElementById('app').innerHTML=S.page==='data-processing'?privacyPage(T):st?testPage(st,T):S.page==='landing'?landing(T):header(T)+`<section class="wrap"><h1>404</h1><p>${S.lang==='ru'?'Страница не найдена':'Page not found'}</p><a href="/">${S.lang==='ru'?'На главную':'Home'}</a></section>`+footer(T);
 document.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{S.lang=b.dataset.l;try{localStorage.setItem('olympiad-language',S.lang)}catch{} render()});
 const agree=document.getElementById('agree'), start=document.getElementById('startBtn');
 if(agree&&start){agree.onchange=()=>start.disabled=!agree.checked;start.onclick=()=>{if(agree.checked&&st.testPath)location.href=st.testPath+'?lang='+S.lang}};
}
render();
