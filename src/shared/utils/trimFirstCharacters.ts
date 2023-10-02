export const trimFirstCharacters = (inputString: string, num: number, toLowerCase?: boolean) => {
  if(toLowerCase) {
    return inputString.toLowerCase().substring(num).trim();
  } else {
    return inputString.substring(num).trim();
  }
};