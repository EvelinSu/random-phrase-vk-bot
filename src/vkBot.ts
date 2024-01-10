import * as dayjs from 'dayjs';
import { clearInterval } from 'timers';
import { MessageContext } from 'vk-io';
import { coreApi } from './api/coreApi';
import { steamApi } from './api/steamApi';
import { commands } from './shared/constants/commands';
import { textContent } from './shared/constants/textContent';
import { DailyPersonalRankType, PhraseType, PlayerType } from './shared/types';
import {
  filterPhrases,
  getFunWords,
  generateRandomSentence,
  trimFirstCharacters,
} from './shared/utils';
import { getPlayerOnlineText } from './shared/utils/getPlayerOnlineText';
import { getRandomPrediction } from './shared/utils/getRandomPrediction';

export class VkBotController {
  messagesToTrigger: number = 4;
  messagesCounter: number = 0;
  phrasesList: PhraseType[] = [];
  nouns: string[] = [];
  chatIds: MessageContext['chatId'][] = [];
  predictions: string[] = [];
  adjectives: string[] = [];
  players: PlayerType[] = [];
  dailyPersonalRank: DailyPersonalRankType[] = [];
  steamIntervalId: NodeJS.Timeout | undefined;
  timerId: NodeJS.Timeout | undefined;

  async uploadPhrases() {
    try {
      this.phrasesList = await coreApi.getPhrases();
    } catch (err) {
      console.log('Ошибка загрузки цитат', err);
    }
  };

  async sendMessage(context: MessageContext, message: string, isReply?: boolean) {
    try {
      if (message && !this.timerId) {
        this.messagesCounter++;

        if (!isReply) await context.send(message);
        if (isReply) await context.reply(message);

        this.timerId = setTimeout(() => {
          this.timerId = undefined;
        }, 1000);
      }
    } catch (err) {
      console.log(textContent.sendMessageError, err);
    }
  };

  async setMessagesToTrigger(context: MessageContext, text: string) {
    const messageText = trimFirstCharacters(text, commands.setMessagesToTrigger.length, false);
    const count = Number(messageText);

    if (count < 1000 && count > 0) {
      this.messagesToTrigger = count;
      await this.sendMessage(context, textContent.updateMessage);
    } else {
      await this.sendMessage(context, textContent.commonErrorMessage);
    }
  };

  async addPhrase(context: MessageContext, text: string) {
    const messageText = trimFirstCharacters(text, commands.addPhrase.length, false);
    const maxMessageTextLength = 500;
    const currentMessageLength = messageText.length;
    const addPhraseLengthErrorText = textContent.addPhraseLengthError(currentMessageLength, maxMessageTextLength);

    try {
      if (!messageText) {
        return;
      }

      if (!messageText || currentMessageLength > maxMessageTextLength) {
        await this.sendMessage(context, addPhraseLengthErrorText);
        return;
      }

      await coreApi.addPhrase(messageText);
      await this.sendMessage(context, textContent.commonSaveMessage);
      await this.uploadPhrases();

    } catch (err) {
      console.log(textContent.addPhraseError, err);
    }
  };

  async sendRandomPhrase(context: MessageContext, array?: PhraseType[]) {
    const data = array || this.phrasesList;
    const randomPhrase = data[Math.floor(Math.random() * data.length)].text;

    await this.sendMessage(context, randomPhrase);
    this.messagesCounter++;
  };

  async sendGeneratedRandomSentence(context: MessageContext) {
    await this.sendMessage(context, generateRandomSentence(this.phrasesList));
  };

  async findAndSendPhrase(context: MessageContext, text: string) {
    const commandLength = commands.getPhrase.length;
    const messageText = trimFirstCharacters(text, commandLength);
    const phrases = filterPhrases(messageText, this.phrasesList);

    if (!messageText) {
      await this.sendRandomPhrase(context);
      return;
    }

    if (phrases?.length) {
      await this.sendRandomPhrase(context, phrases);
    } else {
      await this.sendMessage(context, textContent.phrasesNotFound);
    }
  };

  async sendMessagePeriodically(context: MessageContext) {
    console.log(this.messagesCounter, this.messagesToTrigger)
    if (this.messagesCounter < this.messagesToTrigger) {
      this.messagesCounter++;
    } else {
      this.messagesCounter = 0;
      await this.sendGeneratedRandomSentence(context);
    }
  };

  async generateFunWords(context: MessageContext, text: string) {
    const commandLength = commands.getRandomWords.length;
    let nickname = trimFirstCharacters(text, commandLength, false);

    if (nickname.toLowerCase() === 'я') {
      nickname = 'Ты';
    }

    const result = getFunWords(this.nouns, this.adjectives);
    await this.sendMessage(context, `${nickname} ${result}`);
  };

  async sendDailyRank(context: MessageContext, rank: string) {
    await this.sendMessage(context, `Сегодня ты ${rank}`, true);
  };

  async sendPrediction(context: MessageContext) {
    const commandLength = commands.getPrediction.length;
    const randomBoolean = Math.random() < 0.5;

    if (context.text && context.text.trim().length <= commandLength) {
      await this.sendMessage(context, 'a?', true);
      return;
    }

    if (randomBoolean) {
      const yesNoData = await coreApi.getYesNo();
      await context.sendDocuments({ value: yesNoData.image });
      return;
    }

    const prediction = getRandomPrediction(this.predictions);
    await this.sendMessage(context, prediction, true);
  };

  async uploadData() {
    try {
      this.adjectives = await coreApi.getAdjectives();
      this.nouns = await coreApi.getNouns();
      this.players = await steamApi.getPlayers();
      this.predictions = await coreApi.getPredictions();
      this.dailyPersonalRank = await coreApi.getDailyPersonalRank();
    } catch (err) {
      console.log('Ошибка загрузки данных', err);
    }
  };

  async uploadPlayers() {
    try {
      this.players = await steamApi.getPlayers();
    } catch (err) {
      console.log('Ошибка загрузки юзеров', err);
    }
  };

  async generateDailyPersonalRank(context: MessageContext) {
    const today = dayjs().add(3, 'hour').format('DD.MM.YYYY');
    const userId = context.senderId;
    const currentUser = this.dailyPersonalRank.find((el) => el.userId === userId);
    const rank = getFunWords(this.nouns, this.adjectives);

    if (currentUser && currentUser.day === today) {
      // если юзер с рангом найден и у него уже есть звание на сегодня
      await this.sendDailyRank(context, currentUser?.words);
    }

    if (currentUser && currentUser.day !== today) {
      // если юзер с рангом найден, но ранг просрочен
      await coreApi.updateDailyPersonalRank({ ...currentUser, day: today, words: rank });
      await this.sendDailyRank(context, rank);
    }

    if (!currentUser) {
      // если юзер не найден
      await coreApi.addDailyPersonalRank({ words: rank, userId, day: today });
      await this.sendDailyRank(context, rank);
    }

    await this.uploadData();
  };

  async checkPlayersStatus(ctx: MessageContext) {
    try {
      const playersId = this.players.map((player) => player.steamid);
      const actualPlayersStatus = await steamApi.checkPlayersStatus(playersId, this.players);

      for (let i = 0; i < actualPlayersStatus.length; i++) {
        const player = await actualPlayersStatus[i];

        if (player && !player?.isNotificationSent) {
          await steamApi.putPlayer({ ...player, isNotificationSent: true });
          await this.sendMessage(ctx, getPlayerOnlineText(player));
        }
      }
      await this.uploadPlayers();
    } catch (err) {
      console.log(err);
    }
  };

  async toggleSteamNotifications(ctx: MessageContext) {
    try {
      if (this.chatIds.includes(ctx.chatId)) {
        this.chatIds = this.chatIds.filter(el => el !== ctx.chatId);
        clearInterval(this.steamIntervalId);
        await this.sendMessage(ctx, 'Уведомления отключены');
        return;
      }

      this.chatIds.push(ctx.chatId);
      await this.sendMessage(ctx, 'Уведомления включены');
      this.steamIntervalId = setInterval(() => {
        this.checkPlayersStatus(ctx);
      }, 120000);
    } catch (err) {
      console.log(err);
    }
  };

  async addPlayer(ctx: MessageContext) {
    try {
      const commandLength = commands.addPlayer.length;

      if (ctx.text) {
        const messageText = trimFirstCharacters(ctx.text, commandLength).split(' ');
        const name = messageText[0];
        const steamid = messageText[1];
        const isAlreadyExist = this.players.find(el => el.name === name);

        if (isAlreadyExist) {
          await this.sendMessage(ctx, `Игрок ${name} уже был добавлен ранее`, true);

          return;
        }

        if (name.length && steamid.length > 8) {
          await steamApi.addPlayer({ name, steamid });
          await this.uploadPlayers();
          await this.sendMessage(ctx, `Игрок ${name} добавлен`, true);
        } else {
          await this.sendMessage(ctx, `Некорректная команда. Необходимо ввести ник и steam id. Пример: /игрок Токсик 12345678910111213`, true);
        }
      }
    } catch (err) {
      await this.sendMessage(ctx, `Игрок не был добавлен. Возможно, команда была введена некорректно. Необходимо ввести ник и steam id. Пример: /игрок Токсик 12345678910111213`, true);
    }
  };

  async removePlayer(ctx: MessageContext) {
    try {
      const commandLength = commands.removePlayer.length;

      if (ctx.text) {
        const messageText = trimFirstCharacters(ctx.text, commandLength).split(' ');
        const name = messageText[0];
        const player = this.players.find(el => el.name === name);

        if (player?.id) {
          await steamApi.removePlayer(player.id);
          await this.uploadPlayers();
          await this.sendMessage(ctx, `Игрок ${name} удален`, true);
        } else {
          await this.sendMessage(ctx, `Игрок с ником ${name} не найден`, true);
        }
      }
    } catch (err) {
      await this.sendMessage(ctx, `Ошибка удаления`, true);
    }
  };

  async getOnlinePlayers(ctx: MessageContext) {
    const onlinePlayers: string[] = [];
    this.players.forEach((el) => {
      if (el.isPlayNow) {
        onlinePlayers.push(el.name);
      }
    });

    if (!this.chatIds.includes(ctx.chatId)) {
      await this.sendMessage(ctx, `Для отслеживания онлайна введите ${commands.toggleSteamNotifications}`, true);
      return;
    }

    if (!onlinePlayers.length) {
      await this.sendMessage(ctx, 'Никого нет онлайн......');
      return;
    }

    await this.sendMessage(ctx, `Сейчас в игре: ${onlinePlayers.join(', ')}`);
  }

  async enableBotEvents(ctx: MessageContext) {
    await this.toggleSteamNotifications(ctx);
  }
}
