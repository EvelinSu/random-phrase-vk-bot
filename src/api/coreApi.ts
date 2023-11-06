import axios, { AxiosResponse } from 'axios';
import { v1 } from 'uuid';
import { DailyPersonalRankType, PhraseType, YesNoResponseType } from '../shared/types';

export const jsonApi = axios.create({
  baseURL: 'http://localhost:3000/',
});
const yesNoApi = axios.create({
  baseURL: 'https://yesno.wtf/api/',
});

export const coreApi = {
  getPredictions: async () => {
    const res: AxiosResponse<string[]> = await jsonApi.get('predictions');
    return res.data;
  },
  getPhrases: async () => {
    const res: AxiosResponse<PhraseType[]> = await jsonApi.get('phrases');
    return res.data;
  },
  addPhrase: async (text: string) => {
    const res = await jsonApi.post('phrases', { id: v1(), text });
    return res.data;
  },
  getNouns: async () => {
    const res: AxiosResponse<string[]> = await jsonApi.get('nouns');
    return res.data;
  },
  getAdjectives: async () => {
    const res: AxiosResponse<string[]> = await jsonApi.get('adjectives');
    return res.data;
  },
  getDailyPersonalRank: async () => {
    const res: AxiosResponse<DailyPersonalRankType[]> = await jsonApi.get('dailyPersonalRank');
    return res.data;
  },
  addDailyPersonalRank: async (body: DailyPersonalRankType) => {
    const res: AxiosResponse<DailyPersonalRankType> = await jsonApi.post('dailyPersonalRank', {id: v1(), ...body});
    return res.data;
  },
  getYesNo: async () => {
    const res: AxiosResponse<YesNoResponseType> = await yesNoApi.get('/');
    return res.data;
  },
  updateDailyPersonalRank: async (body: DailyPersonalRankType) => {
    const res: AxiosResponse<DailyPersonalRankType> = await jsonApi.put(`dailyPersonalRank/${body.id}`, body);
    return res.data;
  },
};