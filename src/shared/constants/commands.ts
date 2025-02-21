const prefix = "/"

export const commands = {
  getRandomWords: prefix + 'кто',
  addPhrase: prefix + 'добавь',
  getPhrase: prefix + 'ц',
  getPrediction: prefix + 'ответь',
  setWelcome: prefix + 'приветствие',
  getTodayRank: prefix + 'сегодня я',
  getRandomSentence: prefix + 'вари',
  getBlackList: prefix + 'мразитфм',
  addBlackList: prefix + 'мразьтфм',
  setMessagesToTrigger: prefix + 'частота',
  toggleSteamNotifications: prefix + 'уведомления',
  addPlayer: prefix + 'игрок',
  removePlayer: prefix + 'не игрок',
  getOnlinePlayers: prefix + 'онлайн',

  getCommands: prefix + 'команды',
  getApologize: prefix + 'извинись',
  update: prefix + 'обнови',
  start: 'Начать'
}

export const commandsText =
  `Я бот для шайки палочников. Умею делать разные вещи: \n\n` +
  `${commands.setWelcome} *текст сообщения* - изменить приветственное сообщение \n\n` +
  `${commands.getPhrase} *слово для поиска* - поиск цитат \n\n` +
  `${commands.addPhrase} *текст цитаты* - добавить цитату в список \n\n` +
  `${commands.addBlackList} *текст* - добавить запись в черный список \n\n` +
  `${commands.getBlackList} - поиск по черному списку (если после команды указать текст), вывод всего черного списка (если команда без текста)  \n\n` +
  `${commands.getRandomWords} *имя* - сгенерировать титул \n\n` +
  `${commands.getTodayRank} - получить титул на день \n\n` +
  `${commands.getRandomSentence} - сгенерировать бессмыслицу из цитат \n\n` +
  `${commands.toggleSteamNotifications} - включить уведомления о том, что кто-то зашел в игру через стим \n\n` +
  `${commands.getOnlinePlayers} - показать кто сейчас в игре \n\n` +
  `${commands.getPrediction} *текст вопроса* - получить предсказание \n\n` +
  `${commands.addPlayer} - добавить игрока в отслеживание онлайна по steam id. Пример команды: /игрок Токсик 12345678910111213 \n\n` +
  `${commands.removePlayer} *ник* - удалить игрока из отслеживания онлайна по steam id. \n\n`
