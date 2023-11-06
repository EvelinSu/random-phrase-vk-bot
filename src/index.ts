import { HearManager } from '@vk-io/hear';
import { MessageContext, VK } from 'vk-io';
import { commands, commandsText } from './shared/constants/commands';
import { textContent } from './shared/constants/textContent';
import { getHearRegExp } from './shared/utils';
import { VkBotController } from './vkBot';

require('dotenv').config();

const token = process.env.VK_API_KEY as string;
const vk = new VK({ token });
const hearManager = new HearManager<MessageContext>();
const VkBot = new VkBotController();

hearManager.hear(commands.getCommands, async (ctx) => {
  await VkBot.sendMessage(ctx, commandsText);
});

hearManager.hear(commands.getRandomSentence, async (ctx) => {
  await VkBot.sendGeneratedRandomSentence(ctx);
});

hearManager.hear(commands.getTodayRank, async (ctx) => {
  await VkBot.generateDailyPersonalRank(ctx);
});

hearManager.hear(getHearRegExp(commands.getPrediction), async (ctx) => {
  await VkBot.sendPrediction(ctx);
});

hearManager.hear(getHearRegExp(commands.getPhrase), async (ctx) => {
  const text = ctx.text;

  if (text) {
    await VkBot.findAndSendPhrase(ctx, text);
  } else {
    await VkBot.sendMessage(ctx, textContent.phrasesNotFound);
  }
});

hearManager.hear(getHearRegExp(commands.addPhrase), async (ctx) => {
  const text = ctx.text;

  if (text) {
    await VkBot.addPhrase(ctx, text);
  } else {
    await VkBot.sendMessage(ctx, textContent.addPhraseError);
  }
});

hearManager.hear(getHearRegExp(commands.getRandomWords), async (ctx: MessageContext) => {
  const text = ctx.text;

  if (text) {
    await VkBot.generateFunWords(ctx, text);
  } else {
    await VkBot.sendMessage(ctx, textContent.commonErrorMessage);
  }
});


hearManager.hear(getHearRegExp(commands.getApologize), async (ctx) => {
  const ownerId = Number(process.env.OWNER_VK_ID);

  if (ownerId && (ctx.senderId === ownerId)) {
    await VkBot.sendMessage(ctx, textContent.apologiesOwnerMessage);
  } else {
    await VkBot.sendMessage(ctx, textContent.commonErrorMessage);
  }
});

hearManager.hear(commands.update, async (ctx) => {
  await VkBot.uploadPhrases();
  await VkBot.uploadData();
  await VkBot.sendMessage(ctx, textContent.updateMessage);
});

hearManager.hear(new RegExp(commands.setMessagesToTrigger), async (ctx) => {
  const text = ctx.text;
  if (text) {
    await VkBot.setMessagesToTrigger(ctx, text);
  } else {
    await VkBot.sendMessage(ctx, textContent.commonErrorMessage);
  }
});

hearManager.hear(commands.toggleSteamNotifications, async (ctx) => {
  await VkBot.toggleSteamNotifications(ctx);
});

hearManager.hear(getHearRegExp(commands.addPlayer), async (ctx) => {
  await VkBot.addPlayer(ctx);
});

hearManager.hear(commands.getOnlinePlayers, async (ctx) => {
  await VkBot.getOnlinePlayers(ctx);
});

(async () => {
  await vk.updates.start();
  vk.updates.on('message_new', hearManager.middleware);
  await VkBot.uploadPhrases();
  await VkBot.uploadData();
  console.log('Бот запущен и готов к работе!');
})();
