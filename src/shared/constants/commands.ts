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
  getOnlinePlayers: '/онлайн',

  getCommands: '/команды',
  getApologize: '/извинись',
  update: '/обнови',
}

export const commandsText =
  `${commands.getPhrase} *слово для поиска* - поиск цитат \n` +
  `${commands.addPhrase} *текст цитаты* - добавить цитату в список \n` +
  `${commands.getRandomWords} *имя* - сгенерировать титул \n` +
  `${commands.getTodayRank} - получить титул на день \n` +
  `${commands.getRandomSentence} - сгенерировать бессмыслицу из цитат \n` +
  `${commands.toggleSteamNotifications} - включает уведомления о том, что кто-то зашел в игру через стим \n` +
  `${commands.getOnlinePlayers} - показывает кто сейчас в игре \n` +
  `${commands.getPrediction} *текст вопроса* - получите предсказание \n`