import { HearManager } from "@vk-io/hear";
import { MessageContext, VK } from "vk-io";

import { SessionManager } from "@vk-io/session";
import { commands, commandsText } from "./shared/constants/commands";
import { textContent } from "./shared/constants/textContent";
import { getHearRegExp } from "./shared/utils";
import { VkBotController } from "./vkBot";

require("dotenv").config();

const token = process.env.K_API_KEY as string;
const vk = new VK({ token });
const sessionManager = new SessionManager<MessageContext>({
  getStorageKey: (context) => String(context.peerId),
});

const hearManager = new HearManager<MessageContext>();

const VkBot = new VkBotController(vk);

vk.updates.on("chat_invite_user_by_link", async (context) => {
  try {
    await VkBot.welcome(context);
  } catch (err) {
    console.log(err);
  }
});

vk.updates.on("chat_invite_user", async (context) => {
  try {
    await VkBot.welcome(context);
  } catch (err) {
    console.log(err);
  }
});

vk.updates.on("message_new", async (ctx, next) => {
  const text = ctx.text;

  VkBot.sendMessagePeriodically(ctx);

  switch (text) {
    case commands.start:
      return await VkBot.sendMessage(ctx, commandsText);
    case commands.getCommands:
      return await VkBot.sendMessage(ctx, commandsText);
    case commands.getRandomSentence:
      return await VkBot.sendGeneratedRandomSentence(ctx);
    case commands.getTodayRank:
      return await VkBot.generateDailyPersonalRank(ctx);
    case commands.getOnlinePlayers:
      return await VkBot.getOnlinePlayers(ctx);
    case commands.toggleSteamNotifications:
      return await VkBot.toggleSteamNotifications(ctx);
    default:
      return next();
  }
});


hearManager.hear(getHearRegExp(commands.setWelcome), async (ctx) => {
  await VkBot.changeWelcome(ctx);
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

hearManager.hear(getHearRegExp(commands.removePlayer), async (ctx) => {
  await VkBot.removePlayer(ctx);
});

hearManager.hear(commands.getOnlinePlayers, async (ctx) => {
  await VkBot.getOnlinePlayers(ctx);
});

hearManager.hear(getHearRegExp(commands.getBlackList), async (ctx) => {
  await VkBot.getBlacklist(ctx);
});

hearManager.hear(getHearRegExp(commands.addBlackList), async (ctx) => {
  await VkBot.addBlacklist(ctx);
});


(async () => {
  vk.updates.on("message_new", sessionManager.middleware);
  vk.updates.on("message_new", hearManager.middleware);
  await vk.updates.start();
  await VkBot.uploadPhrases();
  await VkBot.uploadData();
  await VkBot.uploadActiveChatInfos();
  console.log("Бот запущен и готов к работе!");
})();
