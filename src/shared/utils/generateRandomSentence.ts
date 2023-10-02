import { PhraseType } from '../types';

function getRandomSentencePart(sentences: PhraseType[]) {
  const randomSentence = sentences[Math.floor(Math.random() * sentences.length)].text;
  const words = randomSentence.split(' ');
  const numWordsToRemove = Math.floor(Math.random() * 3) + 5;
  const startIndex = Math.floor(Math.random() * words.length);
  const removedWords = words.splice(startIndex, numWordsToRemove);
  const modifiedSentence = removedWords.join(' ');

  return { originalSentence: randomSentence, modifiedSentence };
}

export function generateRandomSentence (sentences: PhraseType[]) {
  const numIterations = Math.floor(Math.random() * 3) + 2; // Случайное количество итераций
  let combinedSentence = '';

  for (let i = 0; i < numIterations; i++) {
    const { modifiedSentence } = getRandomSentencePart(sentences);
    combinedSentence += modifiedSentence;

    if (i < numIterations - 1) {
      combinedSentence += ' ';
    }
  }

  combinedSentence = combinedSentence.trim().toLowerCase();
  combinedSentence = combinedSentence.replace(/[^А-Яа-яЁё\s]|(\s[А-Яа-яЁё]{1,2}\s|\s[А-Яа-яЁё]{1,2}$)/g, ' ').replace(/\s+/g, ' ');

  return combinedSentence.trim().length ? combinedSentence : `ниче не придумал`;
}