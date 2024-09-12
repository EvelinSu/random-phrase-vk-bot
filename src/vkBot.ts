import dayjs from "dayjs";
import { MessageContext, VK } from "vk-io";
import { MessagesSendParams } from "vk-io/lib/api/schemas/params";
import { coreApi } from "./api/coreApi";
import { steamApi } from "./api/steamApi";
import { commands } from "./shared/constants/commands";
import { textContent } from "./shared/constants/textContent";
import { ActiveChatType, DailyPersonalRankType, PhraseType, PlayerType } from "./shared/types";
import {
  filterPhrases,
  getFunWords,
  generateRandomSentence,
  trimFirstCharacters,
} from "./shared/utils";
import { chooseRandomNumber } from "./shared/utils/chooseRandomNumber";
import { getPlayerOnlineText } from "./shared/utils/getPlayerOnlineText";
import { getRandomPrediction } from "./shared/utils/getRandomPrediction";


export class VkBotController {
  send: (params: MessagesSendParams) => Promise<number>;
  messagesToTrigger: number = 100;
  phrasesList: PhraseType[] = [];
  messagesCounter: number = 0;
  nouns: string[] = [];
  activeChatInfos: ActiveChatType[] = [];
  predictions: string[] = [];
  adjectives: string[] = [];
  players: PlayerType[] = [];
  dailyPersonalRank: DailyPersonalRankType[] = [];
  timerId: NodeJS.Timeout | undefined;

  constructor(vk: VK) {
    this.send = vk.api.messages.send;
  }

  async welcome(ctx: MessageContext) {
    try {
      const currentChat = this.getCurrentChatInfo(ctx.peerId);

      if (currentChat) {
        await this.sendMessage(ctx, currentChat.welcome);
      }
    } catch (err) {
      console.log(err);
    }
  };

  async changeWelcome(ctx: MessageContext) {
    try {
      if (!ctx.text) {
        await this.sendMessage(ctx, "а?");
        return;
      }

      const currentChat = this.getCurrentChatInfo(ctx.peerId);

      const commandLength = commands.setWelcome.length;
      const messageText = trimFirstCharacters(ctx.text, commandLength);

      if (!currentChat) {
        return;
      }

      await coreApi.setChatInfoById({ ...currentChat, welcome: messageText });
      await this.uploadActiveChatInfos();
      await this.sendMessage(ctx, "Приветственное сообщение успешно изменено, гав");
    } catch (err) {
      console.log(err);
    }
  };

  async uploadPhrases() {
    try {
      this.phrasesList = await coreApi.getPhrases();
    } catch (err) {
      console.log("Ошибка загрузки цитат", err);
    }
  };

  async sendMessage(context: MessageContext, message: string, isReply?: boolean) {
    try {
      if (message && !this.timerId) {
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
    const randomNum = chooseRandomNumber(1, 2);
    if (this.messagesCounter < this.messagesToTrigger) {
      this.messagesCounter += 1;
    } else {
      this.messagesCounter = 0;
      randomNum === 1
        ? await this.sendGeneratedRandomSentence(context)
        : await this.sendRandomPhrase(context, this.phrasesList);
    }
  };

  async generateFunWords(context: MessageContext, text: string) {
    const commandLength = commands.getRandomWords.length;
    let nickname = trimFirstCharacters(text, commandLength, false);

    if (nickname.toLowerCase() === "я") {
      nickname = "Ты";
    }

    const result = getFunWords(this.nouns, this.adjectives);
    await this.sendMessage(context, `${nickname} ${result}`, true);
  };

  async sendDailyRank(context: MessageContext, rank: string) {
    await this.sendMessage(context, `Сегодня ты ${rank}`, true);
  };

  async sendPrediction(context: MessageContext) {
    const commandLength = commands.getPrediction.length;
    const randomBoolean = Math.random() < 0.5;

    if (context.text && context.text.trim().length <= commandLength) {
      await this.sendMessage(context, "a?", true);
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

  async uploadActiveChatInfos() {
    try {
      this.activeChatInfos = await coreApi.getActiveChats();
    } catch (err) {
      console.log(err);
    }
  };

  async uploadData() {
    try {
      this.adjectives = await coreApi.getAdjectives();
      this.nouns = await coreApi.getNouns();
      this.players = await steamApi.getPlayers();
      this.predictions = await coreApi.getPredictions();
      this.dailyPersonalRank = await coreApi.getDailyPersonalRank();

      setInterval(async () => {
        await this.checkActualPlayersStatus();
      }, 120000);

    } catch (err) {
      console.log("Ошибка загрузки данных", err);
    }
  };

  async uploadPlayers() {
    try {
      this.players = await steamApi.getPlayers();
    } catch (err) {
      console.log("Ошибка загрузки юзеров", err);
    }
  };

  async generateDailyPersonalRank(context: MessageContext) {
    const today = dayjs().add(3, "hour").format("DD.MM.YYYY");
    const userId = context.senderId;
    const currentUser = this.dailyPersonalRank.find((el) => el.userId === userId);
    const rank = getFunWords(this.nouns, this.adjectives);

    if (currentUser && currentUser.day === today && currentUser) {
      // если юзер с рангом найден и у него уже есть звание на сегодня
      await this.sendDailyRank(context, currentUser.words);
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

  async checkActualPlayersStatus() {
    try {
      const actualPlayersStatus = await steamApi.checkPlayersStatus(this.players);

      if (!actualPlayersStatus) {
        return;
      }

      for (const chat of this.activeChatInfos) {
        if (!chat.notificationsEnabled) {
          return;
        }

        for (let i = 0; i < actualPlayersStatus.length; i++) {
          const playerInfo = actualPlayersStatus[i];
          if (playerInfo && !playerInfo?.isNotificationSent) {
            await steamApi.putPlayer({ ...playerInfo, isNotificationSent: true });
            await this.send({ message: getPlayerOnlineText(playerInfo), random_id: Math.random(), peer_id: chat.context.peerId });
          }
        }
      }
      await this.uploadPlayers();
    } catch (err) {
      console.log(err);
    }
  };

  async saveChatInfo(context: MessageContext) {
    try {
      const chatInfo: ActiveChatType = {
        context: context,
        notificationsEnabled: true,
        welcome: "Привет! Ой, то есть... Гав!",
      };

      await this.sendMessage(context, "Уведомления включены");
      await coreApi.addChatInfo(chatInfo);
      await this.uploadActiveChatInfos();

      return chatInfo;
    } catch (err) {
      console.log(err);
    }
  };

  async toggleSteamNotifications(ctx: MessageContext) {
    try {
      let currentChatInfo = this.getCurrentChatInfo(ctx?.peerId);

      if (!currentChatInfo) {
        currentChatInfo = await this.saveChatInfo(ctx);
      }

      if (currentChatInfo?.notificationsEnabled) {
        await coreApi.setChatInfoById({ ...currentChatInfo, notificationsEnabled: false });
        await this.uploadActiveChatInfos();
        await this.sendMessage(ctx, "Уведомления отключены");
        return;
      }

      if (currentChatInfo && !currentChatInfo?.notificationsEnabled) {
        await coreApi.setChatInfoById({ ...currentChatInfo, notificationsEnabled: true });
        await this.uploadActiveChatInfos();
        await this.sendMessage(ctx, "Уведомления включены");
      }

    } catch (err) {
      console.log(err);
    }
  };

  async addPlayer(ctx: MessageContext) {
    try {
      const commandLength = commands.addPlayer.length;

      if (ctx.text) {
        const messageText = trimFirstCharacters(ctx.text, commandLength).split(" ");
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
        const messageText = trimFirstCharacters(ctx.text, commandLength).split(" ");
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

  getCurrentChatInfo(peerId?: number) {
    return this.activeChatInfos.find(el => el.context?.peerId === peerId);
  };

  async getOnlinePlayers(ctx: MessageContext) {
    const onlinePlayers: string[] = [];
    this.players.forEach((el) => {
      if (el.isPlayNow) {
        onlinePlayers.push(el.name);
      }
    });

    if (!onlinePlayers.length) {
      await this.sendMessage(ctx, "Никого из отслеживаемых мышек нет онлайн......");
      return;
    }

    await this.sendMessage(ctx, `Сейчас в игре: ${onlinePlayers.join(", ")}`);
  }
}
