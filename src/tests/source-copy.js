/* Interface copy from the supplied tests, with demo overrides applied by the engine. */
export function sourceCopy(TEST, PARTS) {
function qCount(){ var c = 0; PARTS.forEach(function(P){ P.groups.forEach(function(g){ c += g.qs.length; }); }); return c; }
function plural(n,a,b,c){ var m = n % 10, mm = n % 100; return (m === 1 && mm !== 11) ? a : (m >= 2 && m <= 4 && (mm < 10 || mm >= 20)) ? b : c; }
var NQ = qCount();
var TQ_RU = (TEST.typeQs || []).join(" и "), TQ_EN = (TEST.typeQs || []).join(" and ");
var T = {
 ru:{
  heroEyebrow:"Международная олимпиада «Русский язык: код единства» · 1-й тур",
  heroTitle:"Тест по русскому языку",
  lvl:TEST.lvlRu || (TEST.code + " · уровень " + TEST.level),
  f1b:"90 минут", f1s:"на весь тест",
  f2b:"1 попытка", f2s:"пройти заново нельзя",
  f3b:"3 части", f3s:NQ + " " + plural(NQ, "задание", "задания", "заданий"),
  f4b:"100 баллов", f4s:"максимум",
  rulesTitle:"Перед началом",
  rules:[
   "<b>Тест можно пройти только один раз.</b>",
   (TEST.maxPlays === 1 ? "Аудиозапись можно прослушать <b>только один раз</b>. Её" : "Аудиозапись можно прослушать <b>не больше двух раз</b>. Её")+" нельзя поставить на паузу. Подготовьте наушники или колонки.",
   ((TEST.typeQs || []).length === 1 ? "В задании " : "В заданиях ") + TQ_RU + " нужно " + (TEST.typeWhatRu || "написать слово") + ". Если у вас нет русской клавиатуры, используйте экранную клавиатуру в тесте."
  ],
  formTitle:"Данные участника",
  formSub:"Пишите так же, как в регистрационной анкете. По этим данным организаторы найдут вас и оформят сертификат.",
  lblSur:"Фамилия", lblName:"Имя", lblMail:"Электронная почта", lblMail2:"Повторите электронную почту",
  errSur:"Напишите фамилию", errName:"Напишите имя", errMail:"Проверьте адрес электронной почты", errMail2:"Адреса не совпадают",
  agree:"Данные совпадают с регистрационной анкетой. Я выполняю тест самостоятельно.",
  btnStart:"Начать тест", btnPrev:"Назад", btnNext:"Далее", btnFinish:"Завершить тест", btnRules:"Правила",
  partWord:"ЧАСТЬ", ptsWord:"баллов", ptsShort:"б.",
  twoNote:"Выберите два ответа.",
  kbdHint:"Нет русской раскладки? Включите экранную клавиатуру.", kbdBtn:"Русская клавиатура",
  matchHint:"Нажмите на пункт слева, затем на подходящий вариант справа — появится линия. Чтобы изменить пару, нажмите на пункт слева ещё раз.",
  listen:"Аудио", pWait:"НЕ НАЧАТО", pLive:"ИДЁТ ЗАПИСЬ", pDone:"ПРОСЛУШАНО",
  playsLeft:"Осталось прослушиваний: ", playsNone:"Прослушиваний больше нет",
  playerHint:"<b>Сначала прочитайте задания ниже</b>, потом включайте запись. " + (TEST.maxPlays === 1 ? "Запись можно прослушать только один раз" : "Запись можно прослушать два раза") + ", паузы нет.",
  resume:"Продолжить прослушивание",
  hintUn:"Не завершены задания № ", hintAll:"Все задания выполнены. Можно завершать тест.",
  mFinishT:"Завершить тест?", mFinishB:"После завершения изменить ответы будет нельзя. Пройти тест ещё раз тоже нельзя.",
  mFinishUn:"Не завершено заданий: ", mFinishNumbers:"Номера заданий: ",
  mFinishCheck:"Проверьте, что заполнены все пропуски, составлены все пары и выбрано нужное количество вариантов ответа.",
  mFinishYes:"Да, завершить", mCancel:"Отмена", mOk:"Понятно",
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
  lvl:TEST.code + " · level " + TEST.levelEn,
  f1b:"90 minutes", f1s:"for the whole test",
  f2b:"1 attempt", f2s:"no retakes",
  f3b:"3 parts", f3s:NQ + " tasks",
  f4b:"100 points", f4s:"maximum",
  rulesTitle:"Before you start",
  rules:[
   "<b>You can take the test only once.</b>",
   (TEST.maxPlays === 1 ? "You can play the recording <b>only once</b>. It" : "You can play the recording <b>no more than twice</b>. It")+" cannot be paused. Have headphones or speakers ready.",
   ((TEST.typeQs || []).length === 1 ? "In task " : "In tasks ") + TQ_EN + " you type " + (TEST.typeWhatEn || "a word") + ". If you don't have a Russian keyboard, use the on-screen keyboard in the test."
  ],
  formTitle:"Participant details",
  formSub:"Write them exactly as in your registration form. The organisers use them to find you and issue your certificate.",
  lblSur:"Surname", lblName:"First name", lblMail:"Email", lblMail2:"Repeat your email",
  errSur:"Enter your surname", errName:"Enter your first name", errMail:"Check your email address", errMail2:"The addresses do not match",
  agree:"My details match my registration form. I am taking the test on my own.",
  btnStart:"Start the test", btnPrev:"Back", btnNext:"Next", btnFinish:"Finish the test", btnRules:"Rules",
  partWord:"ЧАСТЬ", ptsWord:"баллов", ptsShort:"б.",
  twoNote:"Выберите два ответа.",
  kbdHint:"No Russian keyboard layout? Turn on the on-screen keyboard.", kbdBtn:"Russian keyboard",
  matchHint:"Tap a sentence on the left, then the matching option on the right — a line will appear. To change a pair, tap the sentence again.",
  listen:"Аудио", pWait:"NOT STARTED", pLive:"PLAYING", pDone:"PLAYED",
  playsLeft:"Plays left: ", playsNone:"No plays left",
  playerHint:"<b>Read the tasks below first</b>, then start the recording. " + (TEST.maxPlays === 1 ? "You can play it only once" : "You can play it twice") + "; it cannot be paused.",
  resume:"Continue listening",
  hintUn:"Incomplete task numbers: ", hintAll:"All tasks are done. You can finish the test.",
  mFinishT:"Finish the test?", mFinishB:"After finishing you will not be able to change your answers or take the test again.",
  mFinishUn:"Incomplete tasks: ", mFinishNumbers:"Task numbers: ",
  mFinishCheck:"Check that all gaps are filled, all pairs are matched and the required number of options is selected.",
  mFinishYes:"Yes, finish", mCancel:"Cancel", mOk:"Got it",
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


return T;
}
