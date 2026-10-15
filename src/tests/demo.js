/** All local tests must use this copy and must have no network result transport. */
export function applyDemoCopy(T) {
  Object.assign(T.ru, {
    demoNotice: 'Деморежим · ответы сохраняются только в этом браузере и никуда не отправляются',
    doneB: 'Это локальная проверка. Тест завершён, ответы никуда не отправлены. Результат на сервере не сохранён и не участвует в олимпиаде.',
    sendingT: 'Завершение локальной проверки',
    sendingB: 'Ответы не отправляются организаторам.',
    mTimeB: 'Тест завершён автоматически. Это локальная проверка: ответы никуда не отправлены.',
    formSub: 'В реальной олимпиаде данные должны совпадать с регистрацией. Здесь используйте вымышленные данные: они останутся только в этом браузере.',
    homeLink: '← На страницу олимпиады',
    restartDemo: 'Пройти демотест ещё раз',
    restartTitle: 'Начать новую демопопытку?',
    restartBody: 'Предыдущие ответы и данные этой локальной попытки будут удалены. Вы снова сможете заполнить форму и открыть задания.',
    restartConfirm: 'Начать заново',
    next: [],
  });
  Object.assign(T.en, {
    demoNotice: 'Demo · answers stay in this browser and are not sent anywhere',
    doneB: 'This is a local check. The test is finished; answers have not been sent anywhere. No result is saved on a server or entered in the Olympiad.',
    sendingT: 'Finishing the local check',
    sendingB: 'Answers are not sent to the organisers.',
    mTimeB: 'The test has finished automatically. This is a local check: answers have not been sent anywhere.',
    formSub: 'In the real Olympiad, details must match your registration. Use fictional details here: they stay in this browser only.',
    homeLink: '← Back to the Olympiad',
    restartDemo: 'Take the demo test again',
    restartTitle: 'Start a new demo attempt?',
    restartBody: 'Answers and participant details from this local attempt will be deleted. You can fill in the form and open the tasks again.',
    restartConfirm: 'Start again',
    next: [],
  });
}
