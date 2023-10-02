export const textContent = {
  addPhraseError: 'Не могу добавить',
  commonSaveMessage: 'Схоронил',
  phrasesNotFound: `Цитаты не найдены ૮ ˙Ⱉ˙ ა`,
  sendMessageError: 'Ошибка отправки.',
  commonErrorMessage: 'гав?',
  updateMessage: 'Обновил',
  apologiesOwnerMessage: 'Извините, хозяин',
  addPhraseLengthError: (currentLength: number, maxLength: number) => {
    return `Не могу добавить. В ней ${currentLength} символов, а ограничение - ${maxLength}`
  }
}