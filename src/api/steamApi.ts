import axios, { AxiosResponse } from 'axios';
import { PlayerType, SteamUserInfoType } from '../shared/types';
import { jsonApi } from './coreApi';

const api = axios.create({
  baseURL: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002`,
});

export const steamApi = {
  getPlayers: async () => {
    const res: AxiosResponse<PlayerType[]> = await jsonApi.get('/steam-players');
    return res.data;
  },
  addPlayer: async (body: PlayerType) => {
    const res: AxiosResponse<string[]> = await jsonApi.post('/steam-players', body);
    return res.data;
  },
  removePlayer: async (id: PlayerType['id']) => {
    const res: AxiosResponse<string[]> = await jsonApi.delete(`/steam-players/${id}`);
    return res.data;
  },
  putPlayer: async (arg: Partial<PlayerType>) => {
    const res: AxiosResponse<PlayerType> = await jsonApi.put(`/steam-players/${arg.id}`, arg);
    return res.data;
  },
  checkPlayersStatus: async (steamIds: SteamUserInfoType['steamid'][], players: PlayerType[]) => {
    try {
      const ids = steamIds.join(',');
      const steamPlayersInfo: AxiosResponse<{ response: { players: SteamUserInfoType[] } }> = await api.get(`/?key=${process.env.STEAM_API_KEY}&steamids=${ids}`);
      const steamPlayersInfoRes = steamPlayersInfo.data.response.players;

      return steamPlayersInfoRes.map(async (steamPlayerInfo) => {
        const currentPlayer = players.find((player) => player.steamid === steamPlayerInfo.steamid) as PlayerType;
        const isInTheGame = (steamPlayerInfo.gameid === process.env.STEAM_GAME_ID || steamPlayerInfo.gameextrainfo === process.env.STEAM_GAME_NAME);
        let actualPlayerInfo: PlayerType;

        if (isInTheGame && currentPlayer.isPlayNow && currentPlayer.isNotificationSent) {
          return currentPlayer;
        }

        if (isInTheGame && !currentPlayer?.isPlayNow) {
          actualPlayerInfo = { ...currentPlayer, isPlayNow: true, isNotificationSent: false };
        } else if (!isInTheGame && currentPlayer.isPlayNow) {
          actualPlayerInfo = { ...currentPlayer, isPlayNow: false, isNotificationSent: false };
        } else {
          actualPlayerInfo = { ...currentPlayer, isPlayNow: false, isNotificationSent: true };
        }

        return actualPlayerInfo;
      });
    } catch (err){
      console.log(err)
    }
  }
};