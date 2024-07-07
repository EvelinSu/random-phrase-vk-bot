export const chooseRandomNumber = (num1: number, num2: number) => {
  const randomIndex = Math.floor(Math.random() * 2);

  return randomIndex === 0 ? num1 : num2;
}