import { PlayerType } from '../types';

export const getPlayerOnlineText = ({ isPlayNow, name }: Partial<PlayerType>) => {
  if (isPlayNow) {
    return `${name} вошел(а) в игру.`;
  } else {
    return `${name} вышел(а) из игры.`;
  }
};