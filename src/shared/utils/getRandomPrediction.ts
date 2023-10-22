export const getRandomPrediction = (predictions: string[]): string => {
    const randomIndex = Math.floor(Math.random() * predictions.length);
    return predictions[randomIndex];
};
