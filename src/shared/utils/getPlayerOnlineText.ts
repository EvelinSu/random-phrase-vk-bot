import { PlayerType } from '../types';

export const getPlayerOnlineText = ({ isPlayNow, name }: Partial<PlayerType>) => {
  if (isPlayNow) {
    return `${name} вошел в игру.`;
  } else {
    return `${name} вышел из игры.`;
  }
};