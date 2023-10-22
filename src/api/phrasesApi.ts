import axios, { AxiosResponse } from 'axios';
import { v1 } from 'uuid';
import { DailyPersonalRankType, PhraseType } from '../shared/types';

const api = axios.create({
  baseURL: 'http://localhost:3000/',
});

export const phrasesApi = {
  getPredictions: async () => {
    const res: AxiosResponse<string[]> = await api.get('predictions');
    return res.data;
  },
  getPhrases: async () => {
    const res: AxiosResponse<PhraseType[]> = await api.get('phrases');
    return res.data;
  },
  addPhrase: async (text: string) => {
    const res = await api.post('phrases', { id: v1(), text });
    return res.data;
  },
  getNouns: async () => {
    const res: AxiosResponse<string[]> = await api.get('nouns');
    return res.data;
  },
  getAdjectives: async () => {
    const res: AxiosResponse<string[]> = await api.get('adjectives');
    return res.data;
  },
  getDailyPersonalRank: async () => {
    const res: AxiosResponse<DailyPersonalRankType[]> = await api.get('dailyPersonalRank');
    return res.data;
  },
  addDailyPersonalRank: async (body: DailyPersonalRankType) => {
    const res: AxiosResponse<DailyPersonalRankType> = await api.post('dailyPersonalRank', {id: v1(), ...body});
    return res.data;
  },
  updateDailyPersonalRank: async (body: DailyPersonalRankType) => {
    const res: AxiosResponse<DailyPersonalRankType> = await api.put(`dailyPersonalRank/${body.id}`, body);
    return res.data;
  },
};