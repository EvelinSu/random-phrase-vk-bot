import { PhraseType } from '../types';

export const filterPhrases = (text: string, phrases: PhraseType[]) => {
  if (text.trim().length) {
    return phrases.filter(el => el.text.toLowerCase().includes(text.toLowerCase()));
  } else {
    return undefined;
  }
};