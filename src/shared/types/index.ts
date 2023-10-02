export type PhraseType = {
  id: string | number,
  text: string
}

export type DailyPersonalRankType = {
  userId: number,
  day: string,
  words: string,
  id?: string,
}
