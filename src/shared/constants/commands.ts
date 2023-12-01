export const commands = {
  getRandomWords: '/кто',
  addPhrase: '/добавь',
  getPhrase: '/ц',
  getPrediction: '/ответь',
  getTodayRank: '/сегодня я',
  getRandomSentence: '/вари',
  setMessagesToTrigger: '/частота',
  toggleSteamNotifications: '/уведомления',
  addPlayer: '/игрок',
  removePlayer: '/не игрок',
  getOnlinePlayers: '/онлайн',

  getCommands: '/команды',
  getApologize: '/извинись',
  update: '/обнови',
}

export const commandsText =
  `${commands.getPhrase} *слово для поиска* - поиск цитат \n\n` +
  `${commands.addPhrase} *текст цитаты* - добавить цитату в список \n\n` +
  `${commands.getRandomWords} *имя* - сгенерировать титул \n\n` +
  `${commands.getTodayRank} - получить титул на день \n\n` +
  `${commands.getRandomSentence} - сгенерировать бессмыслицу из цитат \n\n` +
  `${commands.toggleSteamNotifications} - включает уведомления о том, что кто-то зашел в игру через стим \n\n` +
  `${commands.getOnlinePlayers} - показывает кто сейчас в игре \n\n` +
  `${commands.getPrediction} *текст вопроса* - получите предсказание \n\n` +
  `${commands.addPlayer} - добавить игрока в отслеживание онлайна. Пример команды: /игрок Токсик 12345678910111213 \n\n` +
  `${commands.removePlayer} *ник* - удалить игрока из отслеживание онлайна по steam id. \n\n`