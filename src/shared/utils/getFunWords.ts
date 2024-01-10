const fLetters = ['а', 'я', 'ь'];

function modifiedText(str: string, oldEnding: string, newEnding: string) {
  return str.replace(oldEnding, newEnding);
}

export function getFunWords(nouns: string[], adjectives: string[]) {
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

  const regex = /(?:\s|^)&([А-Яа-я]+)/g;
  const matches = randomNoun.match(regex);
  let modifiedAdjective = randomAdjective;
  let nounLastLetter = '';

  if (matches && matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    const matchParts = lastMatch.split('&');
    if (matchParts.length === 2) {
      nounLastLetter = matchParts[1].charAt(matchParts[1].length - 1);
    }
  } else {
    nounLastLetter = randomNoun.charAt(randomNoun.length - 1);
  }

  if (fLetters.includes(nounLastLetter) && modifiedAdjective.endsWith('ый')) {
    modifiedAdjective = modifiedText(randomAdjective, 'ый', 'ая');
  } else if (fLetters.includes(nounLastLetter) && modifiedAdjective.endsWith('ийся')) {
    modifiedAdjective = modifiedText(randomAdjective, 'ийся', 'аяся');
  } else if (fLetters.includes(nounLastLetter) && modifiedAdjective.endsWith('ой')) {
    modifiedAdjective = modifiedText(randomAdjective, 'ой', 'ая');
  } else if (fLetters.includes(nounLastLetter) && modifiedAdjective.endsWith('ий')) {
    modifiedAdjective = modifiedText(randomAdjective, 'ий', 'ая');
  } else if (['e', 'o'].includes(nounLastLetter) && modifiedAdjective.endsWith('ый')) {
    modifiedAdjective = modifiedText(randomAdjective, 'ый', 'ое');
  } else if (['e', 'o'].includes(nounLastLetter)  && modifiedAdjective.endsWith('ий')) {
    modifiedAdjective = modifiedText(randomAdjective, 'ий', 'ое');
  } else if (['e', 'o'].includes(nounLastLetter) && modifiedAdjective.endsWith('ийся')) {
    modifiedAdjective = modifiedText(randomAdjective, 'ийся', 'ееся');
  }

  return `${modifiedAdjective} ${randomNoun}`.replace(/&/g, '');
}