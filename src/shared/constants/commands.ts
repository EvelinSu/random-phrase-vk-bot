export const commands = {
  getRandomWords: '/кто',
  addPhrase: '/добавь',
  getPhrase: '/ц',
  getPrediction: '/ответь',
  setWelcome: '/приветствие',
  getTodayRank: '/сегодня я',
  getRandomSentence: '/вари',
  setMessagesToTrigger: '/частота',
  toggleSteamNotifications: '/уведомления',
  enableBotEvents: '/старт',
  addPlayer: '/игрок',
  removePlayer: '/не игрок',
  getOnlinePlayers: '/онлайн',

  getCommands: '/команды',
  getApologize: '/извинись',
  update: '/обнови',
  start: 'Начать'
}

export const commandsText =
  `Я бот для шайки палочников. Умею делать разные вещи: \n\n` +
  `${commands.setWelcome} *текст сообщения* - изменить приветственное сообщение \n\n` +
  `${commands.enableBotEvents} - запуск \n\n` +
  `${commands.getPhrase} *слово для поиска* - поиск цитат \n\n` +
  `${commands.addPhrase} *текст цитаты* - добавить цитату в список \n\n` +
  `${commands.getRandomWords} *имя* - сгенерировать титул \n\n` +
  `${commands.getTodayRank} - получить титул на день \n\n` +
  `${commands.getRandomSentence} - сгенерировать бессмыслицу из цитат \n\n` +
  `${commands.toggleSteamNotifications} - включить уведомления о том, что кто-то зашел в игру через стим \n\n` +
  `${commands.getOnlinePlayers} - показать кто сейчас в игре \n\n` +
  `${commands.getPrediction} *текст вопроса* - получить предсказание \n\n` +
  `${commands.addPlayer} - добавить игрока в отслеживание онлайна по steam id. Пример команды: /игрок Токсик 12345678910111213 \n\n` +
  `${commands.removePlayer} *ник* - удалить игрока из отслеживания онлайна по steam id. \n\n`