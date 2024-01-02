/// <reference types="@types/telegram-web-app" />
import { defineStore } from "pinia";

export const useMiniApp = defineStore('miniApp', () => {
    
    const web = window.Telegram.WebApp;
    const BackButton = web.BackButton;
    const MainButton = web.MainButton;
    const initData = web.initData;
    const openTelegramLink = web.openTelegramLink;
    const requestWriteAccess = web.requestWriteAccess;

    return { BackButton, MainButton, initData, openTelegramLink, requestWriteAccess };
})