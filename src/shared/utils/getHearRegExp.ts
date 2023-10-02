export const getHearRegExp = (command: string) => {
  return new RegExp(`^${command}`)
}