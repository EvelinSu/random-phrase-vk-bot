import * as dayjs from 'dayjs';
import { MessageContext } from 'vk-io';
import { phrasesApi } from './api/phrasesApi';
import { commands } from './shared/constants/commands';
import { textContent } from './shared/constants/textContent';
import { DailyPersonalRankType, PhraseType } from './shared/types';
import {
  filterPhrases,
  getFunWords,
  generateRandomSentence,
  trimFirstCharacters,
} from './shared/utils';
import { getRandomPrediction } from './shared/utils/getRandomPrediction';

export class VkBotController {
  messagesToTrigger: number = 4;
  messagesCounter: number = 0;
  phrasesList: PhraseType[] = [];
  nouns: string[] = [];
  predictions: string[] = [];
  adjectives: string[] = [];
  dailyPersonalRank: DailyPersonalRankType[] = [];
  timerId: NodeJS.Timeout | undefined;

  async uploadPhrases () {
    try {
      this.phrasesList = await phrasesApi.getPhrases();
    } catch (err) {
      console.log('Ошибка загрузки цитат', err);
    }
  };

  async sendMessage (context: MessageContext, message: string) {
    try {
      if (message && !this.timerId) {
        this.messagesCounter++;
        await context.send(message);

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

      await phrasesApi.addPhrase(messageText);
      await this.sendMessage(context, textContent.commonSaveMessage);
      await this.uploadPhrases();

    } catch (err) {
      console.log(textContent.addPhraseError, err);
    }
  };

  async sendRandomPhrase (context: MessageContext, array?: PhraseType[]) {
    const data = array || this.phrasesList;
    const randomPhrase = data[Math.floor(Math.random() * data.length)].text;

    await this.sendMessage(context, randomPhrase);
    this.messagesCounter++;
  };

  async sendGeneratedRandomSentence(context: MessageContext) {
    await this.sendMessage(context, generateRandomSentence(this.phrasesList));
  };

  async findAndSendPhrase (context: MessageContext, text: string) {
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
    await this.sendMessage(context, `Сегодня ты ${rank}`);
  };

  async sendPrediction(context: MessageContext) {
    const prediction = getRandomPrediction(this.predictions);
    await this.sendMessage(context, prediction);
  };

  async uploadData() {
    try {
      this.adjectives = await phrasesApi.getAdjectives();
      this.nouns = await phrasesApi.getNouns();
      this.predictions = await phrasesApi.getPredictions();
      this.dailyPersonalRank = await phrasesApi.getDailyPersonalRank();
    } catch (err) {
      console.log('Ошибка загрузки данных', err);
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
      await phrasesApi.updateDailyPersonalRank({ ...currentUser, day: today, words: rank });
      await this.sendDailyRank(context, rank);
    }

    if (!currentUser) {
      // если юзер не найден
      await phrasesApi.addDailyPersonalRank({ words: rank, userId, day: today });
      await this.sendDailyRank(context, rank);
    }

    await this.uploadData();
  };
}
