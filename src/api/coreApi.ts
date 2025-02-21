import axios, { AxiosResponse } from "axios";
import { v1 } from "uuid";
import { ActiveChatType, BlackList, DailyPersonalRankType, PhraseType, YesNoResponseType } from "../shared/types";

export const jsonApi = axios.create({
  baseURL: "http://localhost:3000/",
});
const yesNoApi = axios.create({
  baseURL: "https://yesno.wtf/api/",
});

export const coreApi = {
  getActiveChats: async () => {
    const res: AxiosResponse<ActiveChatType[]> = await jsonApi.get("active-chats");
    return res.data;
  },
  setChatInfoById: async (body: ActiveChatType) => {
    const res: AxiosResponse<ActiveChatType[]> = await jsonApi.put(`active-chats/${body.id}`, body);
    return res.data;
  },
  addChatInfo: async (body: ActiveChatType) => {
    const res: AxiosResponse<ActiveChatType[]> = await jsonApi.post(`active-chats`, { id: v1(), ...body });
    return res.data;
  },
  getPredictions: async () => {
    const res: AxiosResponse<string[]> = await jsonApi.get("predictions");
    return res.data;
  },
  getPhrases: async () => {
    const res: AxiosResponse<PhraseType[]> = await jsonApi.get("phrases");
    return res.data;
  },
  addPhrase: async (text: string) => {
    const res = await jsonApi.post("phrases", { id: v1(), text });
    return res.data;
  },
  getBlackList: async () => {
    const res: AxiosResponse<BlackList[]> = await jsonApi.get("blackList");
    return res.data.map(el => el.text);
  },
  addBlackListItem: async (text: string) => {
    const res = await jsonApi.post("blackList", { id: v1(), text });
    return res.data;
  },
  getNouns: async () => {
    const res: AxiosResponse<string[]> = await jsonApi.get("nouns");
    return res.data;
  },
  getAdjectives: async () => {
    const res: AxiosResponse<string[]> = await jsonApi.get("adjectives");
    return res.data;
  },
  getDailyPersonalRank: async () => {
    const res: AxiosResponse<DailyPersonalRankType[]> = await jsonApi.get("dailyPersonalRank");
    return res.data;
  },
  addDailyPersonalRank: async (body: DailyPersonalRankType) => {
    const res: AxiosResponse<DailyPersonalRankType> = await jsonApi.post("dailyPersonalRank", { id: v1(), ...body });
    return res.data;
  },
  getYesNo: async () => {
    const res: AxiosResponse<YesNoResponseType> = await yesNoApi.get("/");
    return res.data;
  },
  updateDailyPersonalRank: async (body: DailyPersonalRankType) => {
    const res: AxiosResponse<DailyPersonalRankType> = await jsonApi.put(`dailyPersonalRank/${body.id}`, body);
    return res.data;
  },
};