export function applyLiveCopy(T) {
  Object.assign(T.ru, {
    sendingT:'Сохраняем ответы…', sendingB:'Не закрывайте страницу. Дождитесь подтверждения сохранения.',
    doneB:'Тест завершён. Ваши ответы сохранены. Спасибо за участие!',
    errT:'Сохранение пока не подтверждено',
    errB:'Ваши ответы остаются в этом браузере. Проверьте подключение и нажмите «Отправить ещё раз».',
    mTimeB:'Тест завершён автоматически. Дождитесь подтверждения сохранения ответов.',
    homeLink:'← На страницу олимпиады',
  });
  Object.assign(T.en, {
    sendingT:'Saving your answers…', sendingB:'Keep this page open until saving is confirmed.',
    doneB:'The test is complete. Your answers have been saved. Thank you for participating!',
    errT:'Saving has not been confirmed yet',
    errB:'Your answers remain in this browser. Check your connection and select “Send again”.',
    mTimeB:'The test has finished automatically. Please wait for confirmation that your answers are saved.',
    homeLink:'← Back to the Olympiad',
  });
}
