import { DEMO } from "./mode.js";
import { applyLiveCopy } from "./live-copy.js";
import { applyDemoCopy } from "./demo.js";
import "../fonts.css";
import "../design-tokens.css";
import { icon, mountIcons } from "../icons.js";
import { privacyLabels } from "../privacy.js";
import { saveAttempt, clearAfterConfirmedDatabaseSave } from "./attempt-storage.js";
import "./test.css";
import "./shared.css";
export function startTest({ TEST, PARTS, Q, copy, audioPath = "/assets/rki-1.mp3", realtimeAudio = false }) {
const CONTACT_EMAIL = "kafedraru2019@inbox.ru";

"use strict";

var SKEY = (DEMO ? "olympiad_demo_v1_" : "olympiad_live_v1_") + TEST.id;
var LETTERS = ["А","Б","В","Г","Д","Е"];

var T = {
 ru:{
  heroEyebrow:"Международная олимпиада «Русский язык: код единства» · 1-й тур",
  heroTitle:"Тест по русскому языку",
  lvl:"РКИ-1 · уровень А1+/А2",
  f1b:"90 минут", f1s:"на весь тест",
  f2b:"1 попытка", f2s:"пройти заново нельзя",
  f3b:"3 части", f3s:"33 задания",
  f4b:"100 баллов", f4s:"максимум",
  rulesTitle:"Перед началом",
  rules:[
   "<b>Тест можно пройти только один раз.</b>",
   "Аудиозапись можно прослушать <b>не больше двух раз</b>. Её нельзя поставить на паузу. Подготовьте наушники или колонки.",
   "В заданиях 9 и 11 нужно написать слово. Если у вас нет русской клавиатуры, используйте экранную клавиатуру в тесте."
  ],
  formTitle:"Данные участника",
  formSub:"Пишите так же, как в регистрационной анкете. По этим данным организаторы найдут вас и оформят сертификат.",
  lblSur:"Фамилия", lblName:"Имя", lblMail:"Электронная почта", lblMail2:"Повторите электронную почту",
  errSur:"Напишите фамилию", errName:"Напишите имя", errMail:"Проверьте адрес электронной почты", errMail2:"Адреса не совпадают",
  agree:"Данные совпадают с регистрационной анкетой. Я выполняю тест самостоятельно.",
  btnStart:"Начать тест", btnPrev:"Назад", btnNext:"Далее", btnFinish:"Завершить тест", btnRules:"Правила",
  partWord:"Часть", ptsWord:"баллов", ptsShort:"б.",
  twoNote:"Выберите два ответа.",
  kbdHint:"Нет русской раскладки? Включите экранную клавиатуру.", kbdBtn:"Русская клавиатура",
  listen:"Аудио", pWait:"НЕ НАЧАТО", pLive:"ИДЁТ ЗАПИСЬ", pDone:"ПРОСЛУШАНО",
  playsLeft:"Осталось прослушиваний: ", playsNone:"Прослушиваний больше нет",
  playerHint:"<b>Сначала прочитайте задания ниже</b>, потом включайте запись. Запись можно прослушать два раза, паузы нет.",
  resume:"Продолжить прослушивание",
  hintUn:"Без ответа: ", hintAll:"Все задания выполнены. Можно завершать тест.",
  mFinishT:"Завершить тест?", mFinishB:"После завершения изменить ответы будет нельзя. Пройти тест ещё раз тоже нельзя.",
  mFinishUn:"Без ответа осталось заданий: ", mFinishYes:"Да, завершить", mCancel:"Отмена", mOk:"Понятно",
  mStartT:"Начать тест?", mStartB:"Таймер на 90 минут запустится сразу. Остановить его нельзя.", mStartYes:"Начать",
  mTimeT:"Время вышло", mTimeB:"Тест завершён автоматически. Ваши ответы отправляются организаторам.",
  tWarn10:"Осталось 10 минут", tWarn1:"Осталась 1 минута",
  audioErr:"Не удалось воспроизвести запись. Проверьте звук и попробуйте ещё раз.",
  sendingT:"Отправляем ответы…", sendingB:"Не закрывайте страницу. Это займёт несколько секунд.",
  errT:"Ответы пока не отправлены", errB:"Проверьте подключение к интернету и нажмите «Отправить ещё раз». Ваши ответы сохранены на этом устройстве.",
  errMore:"Если отправить не получается, скачайте файл с ответами и пришлите его на ",
  btnResend:"Отправить ещё раз", btnDownload:"Скачать файл с ответами",
  doneT:"Спасибо за участие!", doneB:"Тест завершён, ваши ответы отправлены организаторам.",
  scoreCap:"ваш результат",
  nextT:"Что дальше",
  next:[
   "31 октября результаты первого тура придут на электронную почту, которую вы указали при регистрации.",
   "4–9 ноября — финал для лучших участников каждой группы. Финалистам организаторы пришлют приглашение и инструкции.",
   "Пройти тест ещё раз нельзя. Эту страницу можно закрыть.",
   "Не публикуйте и не пересылайте задания до окончания тура 30 октября."
  ],
  footer:"Международная олимпиада «Русский язык: код единства» · ЧГПУ · Платформа РКИ IPR"
 },
 en:{
  heroEyebrow:"International Olympiad “Russian: the Code of Unity” · Round 1",
  heroTitle:"Russian language test",
  lvl:"РКИ-1 · level A1+/A2",
  f1b:"90 minutes", f1s:"for the whole test",
  f2b:"1 attempt", f2s:"no retakes",
  f3b:"3 parts", f3s:"33 tasks",
  f4b:"100 points", f4s:"maximum",
  rulesTitle:"Before you start",
  rules:[
   "<b>You can take the test only once.</b>",
   "You can play the recording <b>no more than twice</b>. It cannot be paused. Have headphones or speakers ready.",
   "In tasks 9 and 11 you type a word. If you don't have a Russian keyboard, use the on-screen keyboard in the test."
  ],
  formTitle:"Participant details",
  formSub:"Write them exactly as in your registration form. The organisers use them to find you and issue your certificate.",
  lblSur:"Surname", lblName:"First name", lblMail:"Email", lblMail2:"Repeat your email",
  errSur:"Enter your surname", errName:"Enter your first name", errMail:"Check your email address", errMail2:"The addresses do not match",
  agree:"My details match my registration form. I am taking the test on my own.",
  btnStart:"Start the test", btnPrev:"Back", btnNext:"Next", btnFinish:"Finish the test", btnRules:"Rules",
  partWord:"Часть", ptsWord:"баллов", ptsShort:"б.",
  twoNote:"Выберите два ответа.",
  kbdHint:"No Russian keyboard layout? Turn on the on-screen keyboard.", kbdBtn:"Russian keyboard",
  listen:"Аудио", pWait:"NOT STARTED", pLive:"PLAYING", pDone:"PLAYED",
  playsLeft:"Plays left: ", playsNone:"No plays left",
  playerHint:"<b>Read the tasks below first</b>, then start the recording. You can play it twice; it cannot be paused.",
  resume:"Continue listening",
  hintUn:"Not answered: ", hintAll:"All tasks are done. You can finish the test.",
  mFinishT:"Finish the test?", mFinishB:"After finishing you will not be able to change your answers or take the test again.",
  mFinishUn:"Tasks left unanswered: ", mFinishYes:"Yes, finish", mCancel:"Cancel", mOk:"Got it",
  mStartT:"Start the test?", mStartB:"The 90-minute timer starts immediately and cannot be stopped.", mStartYes:"Start",
  mTimeT:"Time is up", mTimeB:"The test has finished automatically. Your answers are being sent to the organisers.",
  tWarn10:"10 minutes left", tWarn1:"1 minute left",
  audioErr:"The recording could not be played. Check the sound and try again.",
  sendingT:"Sending your answers…", sendingB:"Please do not close the page. This takes a few seconds.",
  errT:"Your answers have not been sent yet", errB:"Check your internet connection and press “Send again”. Your answers are saved on this device.",
  errMore:"If sending still fails, download the file with your answers and send it to ",
  btnResend:"Send again", btnDownload:"Download answers file",
  doneT:"Thank you for taking part!", doneB:"The test is finished and your answers have been sent to the organisers.",
  scoreCap:"your result",
  nextT:"What happens next",
  next:[
   "On 31 October, first-round results will be sent to the email you gave when registering.",
   "4–9 November — the final for the best participants in each group. Finalists will receive an invitation and instructions.",
   "You cannot take the test again. You can close this page.",
   "Do not post or forward the tasks before the round ends on 30 October."
  ],
  footer:"International Olympiad “Russian: the Code of Unity” · ChSPU · IPR RFL Platform"
 }
};

if(copy) T = copy;
if(DEMO) applyDemoCopy(T); else applyLiveCopy(T);

/* ===== STATE ===== */
var S = null, lang = "ru", tickId = null, audioEl = null, audioUrl = null, sendTimer = null;
var warned10 = false, warned1 = false;
function fresh(){
  return { v:1, phase:"start", sur:"", name:"", mail:"", answers:{}, cur:0,
           startedAt:0, deadline:0, finishedAt:0, auto:false,
           plays:0, playing:false, pos:0, sid:"", result:null, sendErr:"", lang:"ru" };
}
function load(){ try{ var s = JSON.parse(localStorage.getItem(SKEY)); if(s && s.v === 1) return s; }catch(e){} return fresh(); }
function save(){ try{ saveAttempt(localStorage, SKEY, S); }catch(e){ toast(lang === "en" ? "Browser storage is unavailable. Progress cannot be restored after closing this page." : "Хранилище браузера недоступно. После закрытия страницы прогресс не восстановится."); } }
function t(k){ var v = T[lang][k]; return v != null ? v : T.ru[k]; }
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function mmss(s){ s = Math.max(0, Math.round(s)); var m = Math.floor(s/60); return m + ":" + ("0"+(s%60)).slice(-2); }
function uid(){ var a = new Uint8Array(12); (window.crypto||{}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function(_,i){ a[i]=Math.random()*256|0; }); return Array.prototype.map.call(a, function(b){ return ("0"+b.toString(16)).slice(-2); }).join(""); }
var toastId = null;
function toast(msg){ var el = $("toast"); el.textContent = msg; el.classList.add("on"); clearTimeout(toastId); toastId = setTimeout(function(){ el.classList.remove("on"); }, 2800); }
function show(id){ ["start","test","done"].forEach(function(x){ $(x).classList.toggle("hidden", x !== id); }); window.scrollTo(0,0); }

/* ===== MODAL ===== */
function modal(o){
  var host = $("modalHost"), acts = "";
  if(o.cancel) acts += '<button class="btn btn-ghost" id="mNo">' + esc(o.cancel) + "</button>";
  acts += '<button class="btn ' + (o.danger ? "btn-primary" : "btn-navy") + '" id="mYes">' + esc(o.ok) + "</button>";
  host.innerHTML = '<div class="ovl" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal"><h3 id="modalTitle">' + esc(o.title) + "</h3><p>" + o.body + "</p>" +
    (o.extra ? '<div class="mlist">' + o.extra + "</div>" : "") + '<div class="acts">' + acts + "</div></div></div>";
  var previousFocus = document.activeElement;
  var close = function(){ host.innerHTML = ""; if(previousFocus && previousFocus.isConnected) previousFocus.focus(); };
  host.onkeydown = function(e){
    if(e.key === "Escape" && o.cancel){ e.preventDefault(); close(); }
    if(e.key === "Tab"){
      var buttons = host.querySelectorAll("button"), first=buttons[0], last=buttons[buttons.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus()}
    }
  };
  $("mYes").onclick = function(){ close(); if(o.onOk) o.onOk(); };
  if(o.cancel) $("mNo").onclick = close;
  $("mYes").focus();
}
function rulesHtml(){ return "<ul style='margin:0;padding-left:20px'>" + t("rules").map(function(r){ return "<li style='margin:6px 0'>" + r + "</li>"; }).join("") + "</ul>"; }

/* ===== I18N ===== */
function applyLang(){
  document.documentElement.lang = lang;
  document.querySelectorAll('.privacy-link').forEach(function(a){ a.textContent = privacyLabels[lang]; });
  var nodes = document.querySelectorAll("[data-i18n]");
  for(var i=0;i<nodes.length;i++){ var k = nodes[i].getAttribute("data-i18n"); if(typeof T[lang][k] === "string") nodes[i].innerHTML = T[lang][k]; }
  $("langRu").setAttribute("aria-pressed", lang === "ru");
  $("langEn").setAttribute("aria-pressed", lang === "en");
  $("chipLvl").textContent = t("lvl"); $("heroLvl").textContent = t("lvl");
  $("rulesList").innerHTML = t("rules").map(function(r){ return "<li>" + r + "</li>"; }).join("");
  $("errInfo").innerHTML = esc(t("errMore")) + "<b>" + esc(CONTACT_EMAIL) + "</b>." + (S && S.sendErr ? "<br><small style='opacity:.7'>" + esc(S.sendErr) + "</small>" : "");
  if(S && S.phase === "test") renderPart();
  if(S){ S.lang = lang; save(); }
}

/* ===== START ===== */
function validMail(m){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m); }
function onStart(){
  var sur = $("inSur").value.trim().replace(/\s+/g," "), nm = $("inName").value.trim().replace(/\s+/g," ");
  var m1 = $("inMail").value.trim().toLowerCase();
  var ok = true;
  $("fSur").classList.toggle("bad", !sur); if(!sur) ok = false;
  $("fName").classList.toggle("bad", !nm); if(!nm) ok = false;
  $("fMail").classList.toggle("bad", !validMail(m1)); if(!validMail(m1)) ok = false;
  $("fAgree").classList.toggle("bad", !$("inAgree").checked); if(!$("inAgree").checked) ok = false;
  if(!ok){ toast(lang === "ru" ? "Проверьте поля формы" : "Please check the form"); return; }
  modal({ title:t("mStartT"), body:esc(t("mStartB")), ok:t("mStartYes"), cancel:t("mCancel"), danger:true, onOk:function(){
    S.sur = sur; S.name = nm; S.mail = m1; S.sid = uid();
    S.phase = "test"; S.startedAt = Date.now(); S.deadline = S.startedAt + TEST.limitSec * 1000; S.cur = 0; save();
    enterTest();
  }});
}

/* ===== TIMER (по реальному времени: закрытие вкладки не останавливает отсчёт) ===== */
function left(){ return Math.max(0, Math.round((S.deadline - Date.now()) / 1000)); }
function paintTimer(){
  var l = left(), el = $("timer");
  $("timerTxt").textContent = mmss(l);
  el.className = "timer" + (l <= 60 ? " crit" : l <= 600 ? " warn" : "");
}
function startTimer(){
  $("timer").classList.remove("hidden"); paintTimer();
  if(tickId) clearInterval(tickId);
  tickId = setInterval(function(){
    paintTimer();
    var l = left();
    if(l <= 600 && !warned10){ warned10 = true; toast(t("tWarn10")); }
    if(l <= 60 && !warned1){ warned1 = true; toast(t("tWarn1")); }
    if(l <= 0){ clearInterval(tickId); tickId = null; timeUp(); }
  }, 1000);
}
function timeUp(){
  stopAudio(true);
  modal({ title:t("mTimeT"), body:esc(t("mTimeB")), ok:t("mOk") });
  finishTest(true);
}

/* ===== AUDIO ===== */
function b64ToUrl(){ return audioPath; }
var DUR = TEST.audioSec || 64.5;
function stopAudio(keepState){
  if(audioEl){
    audioEl.onpause = audioEl.onended = audioEl.ontimeupdate = audioEl.onerror = null;
    try{ audioEl.pause(); }catch(e){}
    audioEl = null;
  }
  if(!keepState){ S.playing = false; save(); }
}
function playAudio(){
  var resuming = S.playing; /* запись прервалась (обновили страницу) — продолжаем с того же места без нового прослушивания */
  if(isLive() || (!resuming && S.plays >= TEST.maxPlays)) return;
  var playButton = document.querySelector(".playbtn"); if(playButton) playButton.disabled = true;
  stopAudio(true);
  audioEl = new Audio(); audioEl.preload = "auto"; audioEl.src = b64ToUrl();
  var from = resuming ? (realtimeAudio && S.playStart ? Math.max(0, (Date.now() - S.playStart) / 1000) : (S.pos || 0)) : 0;
  if(resuming && from >= DUR - 0.5){ S.playing = false; S.pos = 0; save(); stopAudio(true); paintPlayer(); return; }
  var begin = function(){
    if(from > 0 && from < DUR){ try{ audioEl.currentTime = from; }catch(e){} }
    audioEl.play().then(function(){
      if(!resuming){ S.plays += 1; S.playStart = Date.now(); }
      S.playing = true; save(); paintPlayer();
    }).catch(function(){ toast(t("audioErr")); stopAudio(true); paintPlayer(); });
  };
  if(audioEl.readyState >= 1) begin(); else audioEl.addEventListener("loadedmetadata", begin, {once:true});
  audioEl.onpause = function(){ if(audioEl && !audioEl.ended){ audioEl.play().catch(function(){}); } };
  audioEl.ontimeupdate = function(){ if(!audioEl) return; S.pos = audioEl.currentTime; save(); if(audioEl.duration) DUR = audioEl.duration; paintPlayer(); };
  audioEl.onended = function(){ S.playing = false; S.pos = 0; save(); stopAudio(true); paintPlayer(); };
  audioEl.onerror = function(){ toast(t("audioErr")); stopAudio(true); paintPlayer(); };
  if(navigator.mediaSession){ try{ ["seekbackward","seekforward","seekto","pause"].forEach(function(a){ navigator.mediaSession.setActionHandler(a, function(){}); }); }catch(e){} }
}
function isLive(){ return !!(audioEl && !audioEl.paused && !audioEl.ended); }
function paintPlayer(){
  var host = $("player"); if(!host) return;
  if(realtimeAudio && S.playing && !audioEl && S.playStart && (Date.now()-S.playStart)/1000 >= DUR-0.5){ S.playing=false; S.pos=0; save(); }
  var live = isLive(), interrupted = S.playing && !live;
  var none = S.plays >= TEST.maxPlays && !S.playing;
  var st = live ? "live" : (S.plays > 0 && !interrupted ? "done" : "wait");
  var btn = host.querySelector(".playbtn");
  btn.disabled = live || none;
  btn.innerHTML = none ? icon("check")
                       : icon("play");
  host.querySelector(".ptitle").textContent = interrupted ? t("resume") : t("listen");
  var leftPlays = Math.max(0, TEST.maxPlays - S.plays);
  host.querySelector(".pmeta").textContent = live ? (mmss(S.pos) + " / " + mmss(DUR)) : (none ? t("playsNone") : (t("playsLeft") + leftPlays + " · " + mmss(DUR)));
  host.querySelector(".pbar div").style.width = (live ? Math.min(100, S.pos / DUR * 100) : (none ? 100 : 0)) + "%";
  var b = host.querySelector(".pstate"); b.className = "pstate " + st; b.textContent = t(st === "live" ? "pLive" : st === "done" ? "pDone" : "pWait");
  host.querySelector(".phint").classList.toggle("hidden", S.plays > 0);
}

/* ===== KEYBOARD ===== */
var KROWS = ["ЁЙЦУКЕНГШЩЗХЪ","ФЫВАПРОЛДЖЭ","ЯЧСМИТЬБЮ"];
var kbdShift = false, kbdTarget = null;
function buildKbd(){
  var h = "";
  KROWS.forEach(function(row){ h += '<div class="krow">'; for(var i=0;i<row.length;i++) h += '<button type="button" data-k="' + row[i] + '">' + row[i].toLowerCase() + "</button>"; h += "</div>"; });
  h += '<div class="krow"><button type="button" class="util wide" data-a="shift" aria-pressed="false">Аа</button><button type="button" data-k="-">-</button><button type="button" class="space" data-k=" ">&nbsp;</button><button type="button" class="util wide" data-a="back">&#9003;</button></div>';
  $("kbd").innerHTML = h;
  $("kbd").querySelectorAll("button").forEach(function(b){
    b.addEventListener("mousedown", function(e){ e.preventDefault(); });
    b.addEventListener("click", function(){
      var a = this.dataset.a;
      if(a === "shift"){ kbdShift = !kbdShift; paintKbd(); return; }
      if(a === "back"){ kbdBack(); return; }
      kbdType(this.dataset.k);
    });
  });
}
function paintKbd(){
  $("kbd").querySelectorAll("button[data-k]").forEach(function(b){ var c = b.dataset.k; if(c !== " " && c !== "-") b.textContent = kbdShift ? c : c.toLowerCase(); });
  var sh = $("kbd").querySelector('[data-a="shift"]'); if(sh) sh.setAttribute("aria-pressed", kbdShift);
}
function kbdField(){ return (kbdTarget && document.body.contains(kbdTarget)) ? kbdTarget : null; }
function kbdType(ch){
  var el = kbdField(); if(!el) return;
  var out = (ch === " " || ch === "-") ? ch : (kbdShift ? ch : ch.toLowerCase());
  var s = el.selectionStart, e = el.selectionEnd; if(s == null){ s = e = el.value.length; }
  var max = el.maxLength > 0 ? el.maxLength : 999, next = el.value.slice(0, s) + out + el.value.slice(e);
  if(next.length > max) return;
  el.value = next; el.setSelectionRange(s + out.length, s + out.length); el.focus();
  if(kbdShift){ kbdShift = false; paintKbd(); }
  el.dispatchEvent(new Event("input", {bubbles:true}));
}
function kbdBack(){
  var el = kbdField(); if(!el) return;
  var s = el.selectionStart, e = el.selectionEnd; if(s == null){ s = e = el.value.length; }
  if(s === e){ if(s === 0) return; s -= 1; }
  el.value = el.value.slice(0, s) + el.value.slice(e); el.setSelectionRange(s, s); el.focus();
  el.dispatchEvent(new Event("input", {bubbles:true}));
}
var mPend = null; /* {q, side, k} */
function matchClick(n, side, k){
  var a = (S.answers[n] && typeof S.answers[n] === "object" && !Array.isArray(S.answers[n])) ? S.answers[n] : {};
  var leftOf = function(r){ for(var L in a){ if(a[L] === r) return L; } return null; };
  if(mPend && mPend.q === n && mPend.side !== side){
    var L = side === "L" ? k : mPend.k, Rk = side === "R" ? k : mPend.k;
    var old = leftOf(Rk); if(old) delete a[old];
    a[L] = Rk; mPend = null;
  } else if(mPend && mPend.q === n && mPend.side === side && mPend.k === k){
    mPend = null;
  } else {
    if(side === "L" && a[k]) delete a[k];
    if(side === "R"){ var o = leftOf(k); if(o) delete a[o]; }
    mPend = { q:n, side:side, k:k };
  }
  S.answers[n] = a; touched(n); paintMatches();
}
function paintMatches(){
  document.querySelectorAll(".match").forEach(function(box){
    var n = +box.id.slice(1), a = S.answers[n] || {}, svg = box.querySelector("svg"), br = box.getBoundingClientRect(), lines = "";
    var used = {}; for(var L in a) used[a[L]] = 1;
    box.querySelectorAll(".mitem").forEach(function(b){
      var s = b.dataset.side, k = b.dataset.k;
      b.setAttribute("aria-pressed", String(s === "L" ? !!a[k] : !!used[k]));
      b.setAttribute("aria-label", b.textContent + (s === "L" && a[k] ? " → " + a[k] : ""));
      b.classList.toggle("on", s === "L" ? !!a[k] : !!used[k]);
      b.classList.toggle("pend", !!(mPend && mPend.q === n && mPend.side === s && mPend.k === k));
    });
    for(var L2 in a){
      var l = box.querySelector('.ml [data-k="' + L2 + '"]'), r = box.querySelector('.mr [data-k="' + a[L2] + '"]');
      if(!l || !r) continue;
      var lr = l.getBoundingClientRect(), rr = r.getBoundingClientRect();
      lines += '<line x1="' + (lr.right - br.left) + '" y1="' + (lr.top + lr.height/2 - br.top) + '" x2="' + (rr.left - br.left) + '" y2="' + (rr.top + rr.height/2 - br.top) + '"/>';
    }
    svg.innerHTML = lines;
  });
}
window.addEventListener("resize", function(){ if(S && S.phase === "test") paintMatches(); });
function toggleKbdIn(n){
  var slot = $("kslot" + n), btn = $("kbtn" + n), kbd = $("kbd");
  var open = kbd.parentNode === slot && !kbd.classList.contains("hidden");
  document.querySelectorAll("[id^=kbtn]").forEach(function(b){ b.setAttribute("aria-pressed","false"); });
  if(open){ kbd.classList.add("hidden"); $("kbdPark").appendChild(kbd); return; }
  slot.appendChild(kbd); kbd.classList.remove("hidden"); btn.setAttribute("aria-pressed","true");
  var first = $("q" + n).querySelector("input.gap"); kbdTarget = first; if(first) first.focus();
}

/* ===== RENDER TEST ===== */
function answered(n){
  var a = S.answers[n], q = Q[n];
  if(a == null) return false;
  if(q.type === "two") return Array.isArray(a) && a.length === 2;
  if(q.type === "multi") return Array.isArray(a) && a.length > 0;
  if(q.type === "match") return typeof a === "object" && Object.keys(a).length === q.left.length;
  if(q.type === "gap2") return Array.isArray(a) && a[0] && a[1] && a[0].trim() !== "" && a[1].trim() !== "";
  if(q.type === "gap" || q.type === "select") return String(a).trim() !== "";
  return true;
}
function qHtml(n){
  var q = Q[n], a = S.answers[n], h = "";
  h += '<div class="card q" id="q' + n + '"><div class="qstem"><span class="qnum">' + n + ".</span><span>" + esc(q.s) + "</span></div>";
  if(q.ctx) h += '<div class="ctx">' + q.ctx.map(function(c){ return "<div>" + esc(c) + "</div>"; }).join("") + "</div>";
  if(q.type === "gap2"){
    var v = Array.isArray(a) ? a : ["",""];
    h += '<div class="gapline">' + esc(q.parts[0]) + '<input class="gap" data-q="' + n + '" data-i="0" maxlength="40" autocomplete="off" spellcheck="false" value="' + esc(v[0]||"") + '">' + esc(q.parts[1]) +
         '<input class="gap" data-q="' + n + '" data-i="1" maxlength="40" autocomplete="off" spellcheck="false" value="' + esc(v[1]||"") + '">' + esc(q.parts[2]) + "</div>";
  } else if(q.type === "gap"){
    h += '<div class="gapline">' + esc(q.lead || (q.parts ? q.parts[0] : "")) + '<input class="gap' + (q.wide ? " wide" : "") + '" data-q="' + n + '" maxlength="40" autocomplete="off" spellcheck="false" value="' + esc(a||"") + '">' + esc(q.parts ? q.parts[1] : "") + "</div>";
  } else if(q.type === "select"){
    h += '<div class="gapline">' + esc(q.parts[0]) + '<select class="gap sel" data-q="' + n + '"><option value="">— выберите —</option>' +
         q.o.map(function(o, i){ return '<option value="' + LETTERS[i] + '"' + (a === LETTERS[i] ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") +
         "</select>" + esc(q.parts[1]) + "</div>";
  } else if(q.type === "match"){
    h += '<div class="mhint">' + esc(t("matchHint")) + '</div><div class="match" id="m' + n + '"><svg class="mlines"></svg><div class="mcol ml">' +
         q.left.map(function(x, i){ return '<button type="button" class="mitem" data-q="' + n + '" data-side="L" data-k="' + LETTERS[i] + '"><span class="mk">' + LETTERS[i] + '</span><span>' + esc(x) + '</span><i class="dot"></i></button>'; }).join("") +
         '</div><div class="mcol mr">' +
         q.right.map(function(x, i){ return '<button type="button" class="mitem" data-q="' + n + '" data-side="R" data-k="' + (i+1) + '"><span class="mk">' + (i+1) + '</span><span>' + esc(x) + '</span><i class="dot"></i></button>'; }).join("") +
         "</div></div>";
  } else {
    var multi = q.type === "two" || q.type === "multi";
    if(q.type === "two") h += '<div class="twonote">' + esc(t("twoNote")) + "</div>";
    q.o.forEach(function(o, i){
      var L = LETTERS[i], checked = multi ? (Array.isArray(a) && a.indexOf(L) >= 0) : a === L;
      h += '<label class="opt' + (multi ? " sq" : "") + '"><input type="' + (multi ? "checkbox" : "radio") + '" name="q' + n + '" value="' + L + '"' + (checked ? " checked" : "") + '>' +
           '<span class="mark">' + L + '</span><span class="otext">' + esc(o) + "</span></label>";
    });
  }
  if(q.type === "gap" || q.type === "gap2"){
    h += '<div class="kbdbox"><div class="kbdrow-top"><span class="kbdhint">' + esc(t("kbdHint")) + '</span><button class="iconbtn" type="button" id="kbtn' + n + '" aria-pressed="false" data-kq="' + n + '">' +
         icon("keyboard") +
         esc(t("kbdBtn")) + '</button></div><div id="kslot' + n + '"></div></div>';
  }
  return h + "</div>";
}
function partQs(i){ var o = []; PARTS[i].groups.forEach(function(g){ o = o.concat(g.qs); }); return o; }
function allQs(){ var o = []; for(var i=0;i<PARTS.length;i++) o = o.concat(partQs(i)); return o; }
function renderTabs(){
  $("tabs").innerHTML = PARTS.map(function(P, i){
    var qs = partQs(i), done = qs.filter(answered).length;
    return '<button class="tab" data-tab="' + i + '" aria-current="' + (i === S.cur) + '">' + P.n + ". " + esc(P.title) +
           "<small>" + done + " / " + qs.length + "</small></button>";
  }).join("");
  $("tabs").querySelectorAll(".tab").forEach(function(b){ b.onclick = function(){ goTo(+this.dataset.tab); }; });
}
function renderPart(){
  var P = PARTS[S.cur], h = "";
  $("kbdPark").appendChild($("kbd")); $("kbd").classList.add("hidden");
  h += '<div class="parthead"><h2>' + t("partWord") + " " + P.n + " · " + esc(P.title) + "</h2><p>" +
       esc(P.instr).replace(/\n/g, "<br>") + (TEST.hidePartPts ? "" : " · " + P.pts + " " + t("ptsWord")) + "</p></div>";
  if(P.audio) h += '<div class="card player" id="player"><button class="playbtn" aria-label="play"></button><div class="pinfo"><div class="ptitle"></div><div class="pmeta"></div></div><div class="pstate wait"></div><div class="pbar"><div></div></div><div class="phint">' + t("playerHint") + "</div></div>";
  P.groups.forEach(function(G){
    if(G.label) h += '<div class="group"><b>' + esc(G.label) + "</b>" + (G.note ? "<i>" + esc(G.note) + "</i>" : "") + "</div>";
    if(G.text) h += '<div class="card rtext"><h3>' + esc(G.text.title) + "</h3>" + G.text.paras.map(function(p){ return "<p>" + esc(p) + "</p>"; }).join("") + "</div>";
    h += '<div class="qlist">' + G.qs.map(qHtml).join("") + "</div>";
  });
  $("partHost").innerHTML = h;
  if(P.audio){ $("player").querySelector(".playbtn").onclick = playAudio; paintPlayer(); }
  $("partHost").querySelectorAll("input[type=radio]").forEach(function(r){ r.onchange = function(){ var n = +this.name.slice(1); S.answers[n] = this.value; touched(n); }; });
  $("partHost").querySelectorAll("input[type=checkbox]").forEach(function(c){ c.onchange = function(){
    var n = +this.name.slice(1), box = $("q" + n), sel = [].slice.call(box.querySelectorAll("input:checked")).map(function(x){ return x.value; });
    if(Q[n].type === "two" && sel.length > 2){ this.checked = false; sel = sel.filter(function(v){ return v !== this.value; }, this); toast(t("twoNote")); }
    S.answers[n] = sel; touched(n); }; });
  $("partHost").querySelectorAll("input.gap").forEach(function(g){
    g.addEventListener("focus", function(){ kbdTarget = g; });
    g.addEventListener("input", function(){
      var n = +g.dataset.q;
      if(Q[n].type === "gap2"){ var a = Array.isArray(S.answers[n]) ? S.answers[n] : ["",""]; a[+g.dataset.i] = g.value; S.answers[n] = a; }
      else S.answers[n] = g.value;
      touched(n, true);
    });
  });
  $("partHost").querySelectorAll("[data-kq]").forEach(function(b){ b.onclick = function(){ toggleKbdIn(+this.dataset.kq); }; });
  $("partHost").querySelectorAll("select.sel").forEach(function(s){ s.onchange = function(){ S.answers[+s.dataset.q] = s.value; touched(+s.dataset.q); }; });
  $("partHost").querySelectorAll(".mitem").forEach(function(b){ b.onclick = function(){ matchClick(+this.dataset.q, this.dataset.side, this.dataset.k); }; });
  paintMatches(); requestAnimationFrame(paintMatches);
  renderTabs(); paintNav(); paintRule();
}
function touched(n, quiet){ save(); var c = $("q" + n); if(c) c.classList.remove("unanswered-hl"); renderTabs(); paintNav(); paintRule(); }
function unanswered(){ return allQs().filter(function(n){ return !answered(n); }); }
function paintNav(){
  var last = S.cur === PARTS.length - 1;
  $("btnPrev").disabled = S.cur === 0;
  $("btnNext").classList.toggle("hidden", last);
  $("btnFinish").classList.toggle("hidden", !last);
  var un = unanswered();
  $("navHint").textContent = un.length ? t("hintUn") + un.join(", ") : t("hintAll");
}
function paintRule(){ var all = allQs(); $("ruleFill").style.width = (all.filter(answered).length / all.length * 100) + "%"; }
function goTo(i){ if(i < 0 || i >= PARTS.length) return; S.cur = i; save(); renderPart(); window.scrollTo({top:0, behavior:"smooth"}); }
function enterTest(){
  show("test");
  $("btnRules").classList.remove("hidden");
  startTimer(); renderPart();
  if(left() <= 0) timeUp();
}
function askFinish(){
  var un = unanswered();
  un.forEach(function(n){ var c = $("q" + n); if(c) c.classList.add("unanswered-hl"); });
  modal({ title:t("mFinishT"), body:esc(t("mFinishB")), extra: un.length ? esc(t("mFinishUn")) + un.join(", ") : "",
          ok:t("mFinishYes"), cancel:t("mCancel"), danger:true, onOk:function(){ finishTest(false); } });
}

/* ===== ОТПРАВКА ===== */
function payload(){
  var ans = {};
  allQs().forEach(function(n){ var a = S.answers[n]; ans[n] = a == null ? "" : a; });
  return { testId:TEST.id, sid:S.sid, surname:S.sur, name:S.name, email:S.mail, answers:ans,
           startedAt:new Date(S.startedAt).toISOString(), finishedAt:new Date(S.finishedAt).toISOString(),
           seconds:Math.round((S.finishedAt - S.startedAt) / 1000), auto:S.auto, plays:S.plays, lang:lang,
           ua:navigator.userAgent.slice(0, 200) };
}
function finishTest(auto){
  if(S.phase !== "test") return;
  stopAudio(); if(tickId){ clearInterval(tickId); tickId = null; }
  S.phase = "sending"; S.auto = !!auto; S.finishedAt = Date.now(); save();
  $("timer").classList.add("hidden"); $("btnRules").classList.add("hidden");
  send();
}
var sendBusy = false;
async function send(){
  if(sendBusy) return;
  if(DEMO){ S.phase = "done"; S.result = null; S.sendErr = ""; save(); showDone(); return; }
  sendBusy = true;
  // Freeze every submitted field (including UA/language) for idempotent retries.
  if(!S.submission) S.submission = payload();
  const submission = S.submission;
  S.phase = "sending"; S.sendErr = ""; save();
  show("done"); $("stSending").classList.remove("hidden");
  $("stError").classList.add("hidden"); $("stDone").classList.add("hidden");
  try {
    const response = await fetch("/api/attempts", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify(submission), signal:AbortSignal.timeout(20000)
    });
    const result = await response.json();
    if(!response.ok || result.ok !== true || result.saved !== true || result.sid !== submission.sid || result.testId !== TEST.id) {
      throw new Error(lang === "en" ? "The server has not confirmed saving. Please retry." : "Сервер не подтвердил сохранение. Повторите отправку.");
    }
    try { S = clearAfterConfirmedDatabaseSave(localStorage, SKEY, S); }
    catch { throw new Error(lang === "en" ? "Answers are saved on the server, but browser storage could not be cleared. Click Send again to retry cleanup." : "Ответы сохранены на сервере, но не удалось очистить хранилище браузера. Нажмите «Отправить ещё раз» для повторной очистки."); }
    ["inSur","inName","inMail"].forEach(id=>$(id).value="");
    $("partHost").innerHTML="";
    showDone();
  } catch(err) {
    if(S.serverSaved === true){ showDone(); return; }
    S.phase="error";
    S.sendErr = err.name === "AbortError" || err.name === "TimeoutError" || err instanceof TypeError
      ? (lang === "en" ? "Connection interrupted. Retry with your saved answers." : "Соединение прервано. Повторите отправку сохранённых ответов.") : err.message;
    save(); showError();
  } finally { sendBusy=false; }
}
function showDone(){
  show("done");
  $("btnRestartDemo").classList.toggle("hidden", !DEMO || S.serverSaved === true);
  $("stSending").classList.add("hidden"); $("stError").classList.add("hidden"); $("stDone").classList.remove("hidden");
  var r = {};
  $("scoreBox").classList.add("hidden");
  $("scoreVal").textContent = r.score == null ? "—" : r.score;
  $("scoreMax").textContent = r.max || TEST.total;
  $("ruleFill").style.width = "100%";
}
function showError(){
  show("done");
  $("stSending").classList.add("hidden"); $("stDone").classList.add("hidden"); $("stError").classList.remove("hidden");
  applyLang();
}
function download(){
  var p = payload(), lines = ["Олимпиада «Русский язык: код единства» — " + TEST.title, "Фамилия: " + p.surname, "Имя: " + p.name, "E-mail: " + p.email,
    "Начало: " + p.startedAt, "Конец: " + p.finishedAt, "ID: " + p.sid, ""];
  Object.keys(p.answers).forEach(function(n){ var a = p.answers[n]; lines.push(n + ": " + (Array.isArray(a) ? a.join(" | ") : a)); });
  lines.push("", "DATA:" + JSON.stringify(p));
  var blob = new Blob([lines.join("\r\n")], {type:"text/plain;charset=utf-8"}), a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = TEST.id + "_" + (p.surname || "answers").replace(/[^\wА-Яа-яЁё-]+/g, "_") + ".txt";
  document.body.appendChild(a); a.click(); setTimeout(function(){ a.remove(); }, 100);
}

/* ===== INIT ===== */
(function init(){
  mountIcons();
  S = load(); lang = new URLSearchParams(location.search).get("lang") || S.lang || "ru"; if(!T[lang]) lang="ru"; history.replaceState(null,"",location.pathname);
  if(TEST.noEn){ lang="ru"; document.querySelector(".lang").classList.add("hidden"); }
  if(DEMO) $("demoBar").classList.remove("hidden");
  buildKbd();
  $("langRu").onclick = function(){ lang = "ru"; applyLang(); };
  $("langEn").onclick = function(){ lang = "en"; applyLang(); };
  $("btnStart").onclick = onStart;
  $("btnPrev").onclick = function(){ goTo(S.cur - 1); };
  $("btnNext").onclick = function(){ goTo(S.cur + 1); };
  $("btnFinish").onclick = askFinish;
  $("btnRules").onclick = function(){ modal({ title:t("rulesTitle"), body:rulesHtml(), ok:t("mOk") }); };
  $("btnResend").onclick = send;
  $("btnDownload").onclick = download;
  $("btnRestartDemo").onclick = function(){
    if(!DEMO || S.phase !== "done") return;
    modal({ title:t("restartTitle"), body:esc(t("restartBody")), ok:t("restartConfirm"), cancel:t("mCancel"), onOk:function(){
      S = fresh(); S.lang = lang; save();
      // Reset in-memory state too: pagehide persists it before reloading.
      location.reload();
    }});
  };
  ["inSur","inName","inMail"].forEach(function(id){ $(id).addEventListener("input", function(){ this.parentNode.classList.remove("bad"); }); });
  $("inAgree").onchange = function(){ $("fAgree").classList.remove("bad"); };
  window.addEventListener("beforeunload", function(e){ if(S.phase === "test" || S.phase === "sending"){ e.preventDefault(); e.returnValue = ""; } });
  applyLang();
  if(S.phase === "test") enterTest();
  else if(S.phase === "sending") send();
  else if(S.phase === "error") showError();
  else if(S.phase === "done") showDone();
  else { show("start"); $("inSur").value=S.sur; $("inName").value=S.name; $("inMail").value=S.mail; }
  ["inSur","inName","inMail"].forEach(function(id,i){$(id).addEventListener("input",function(){if(S.phase==="start"){S[["sur","name","mail"][i]]=this.value;save()}})});
  window.addEventListener("pagehide",save);
  window.addEventListener("storage",function(e){
    if(e.key!==SKEY || !e.newValue) return;
    try{const marker=JSON.parse(e.newValue);if(marker.serverSaved===true){
      stopAudio(true);if(tickId)clearInterval(tickId);S=marker;
      ["inSur","inName","inMail"].forEach(id=>$(id).value="");$("partHost").innerHTML="";
      $("timer").classList.add("hidden");$("btnRules").classList.add("hidden");showDone();
    }}catch{}
  });
  document.addEventListener("visibilitychange",function(){if(S.phase==="test" && left()<=0)timeUp()});
})();

}
