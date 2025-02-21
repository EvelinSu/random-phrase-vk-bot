import { MessageContext } from "vk-io";

export type PhraseType = {
    id: string | number,
    text: string
}

export type BlackList = {
    id: string | number,
    text: string
}

export type DailyPersonalRankType = {
    userId: number,
    day: string,
    words: string,
    id?: string,
}

export type YesNoResponseType = {
    answer: 'yes' | 'no' | 'maybe',
    forced: boolean,
    image: string,
}

export type SteamUserInfoType = {
    steamid: string,
    gameextrainfo?: string,
    gameid?: string
}

export type PlayerType = {
    id?: string,
    name: string,
    steamid: SteamUserInfoType['steamid'],
    lastPlayTime?: string,
    isPlayNow?: boolean,
    isNotificationSent?: boolean,
}

export type ActiveChatType = {
    id?: string,
    context: MessageContext,
    notificationsEnabled: boolean,
    welcome: string,
}
