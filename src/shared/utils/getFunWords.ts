const fLetters = ['а', 'я', 'ь'];

export function getFunWords(nouns: string[], adjectives: string[]) {
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

  const nounLastLetter = randomNoun.charAt(randomNoun.length - 1);
  let modifiedAdjective = randomAdjective;

  if (fLetters.includes(nounLastLetter)) {
    modifiedAdjective = randomAdjective.replace('ый', 'ая');
  } else if (fLetters.includes(nounLastLetter) && modifiedAdjective.endsWith('ийся')) {
    modifiedAdjective = randomAdjective.replace('ийся', 'аяся')
  } else if (fLetters.includes(nounLastLetter) && modifiedAdjective.endsWith('ий')) {
    modifiedAdjective = randomAdjective.replace('ий', 'ая')
  }

  return `${modifiedAdjective} ${randomNoun}`;
}