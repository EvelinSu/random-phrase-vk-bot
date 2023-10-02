export const commands = {
  getRandomWords: '/кто',
  addPhrase: '/добавь',
  getPhrase: '/ц',
  getTodayRank: '/сегодня я',
  getRandomSentence: '/вари',

  getCommands: '/команды',
  getApologize: '/извинись',
  update: '/обнови',
}

export const commandsText =
  `${commands.getPhrase} *слово для поиска* - поиск цитат \n` +
  `${commands.addPhrase} *текст цитаты* - добавить цитату в список \n` +
  `${commands.getRandomWords} *имя* - сгенерировать титул \n` +
  `${commands.getTodayRank} - получить титул на день \n` +
  `${commands.getRandomSentence} - сгенерировать бессмыслицу из цитат \n`