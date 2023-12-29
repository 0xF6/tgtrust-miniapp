import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface miniAppUser {
    id: string;
    username: string;
    userId: number;
    firstLastName: string;
    currentPeriodExecutionCount: number;
    currentPeriodExecutionStart: string;
}

export interface miniAppUserTrustResponse {
    verdict: "VerifiedStage" | "CertifiedStage" | "PerfectStage" | "GoodStage" | "LowerStage" | "BadStage" | "AwfulStage";
    trustIndex: number;
    avatar: { url: string, extensions: string } | null;
    username: string;
    name: string,
    periodData: { count: number, currentExecutionDate: string }
}



export const useMainStore = defineStore('main', () => {
    const currentPeriodExecutionCount = ref(4)
    const currentPeriodExecutionStart = ref(0)
    const hasErrorAuth = ref(false)
    const hasLoaded = ref(false)
    const meId = ref('')
    async function getMeRequest() {
        if (hasLoaded.value)
            return;

        const config = {headers: { Authorization: (window as any).Telegram.WebApp.initData }};
        const resp = await axios
            .get('https://trust.0xf6.moe/@/miniapp/me', config);
        console.log("Request to 'https://trust.0xf6.moe/@/miniapp/me', result:", resp.status, resp.data, resp.headers);
        console.log("Request config", config);
        if (resp.status !== 200) {
            hasErrorAuth.value = true;
            return;
        }
        const user = (resp.data as miniAppUser);

        currentPeriodExecutionCount.value = user.currentPeriodExecutionCount;
        currentPeriodExecutionStart.value = (new Date().getTime() - Date.parse(user.currentPeriodExecutionStart));
        meId.value = user.id;
        hasLoaded.value = true;
    }


    async function getTrustFor(username: string): Promise<miniAppUserTrustResponse | null> {
        if (hasErrorAuth.value)
            return null;
        if (!hasLoaded.value)
            return null;

        const config = {headers: { Authorization: (window as any).Telegram.WebApp.initData }};

        const response = await fetch(`https://trust.0xf6.moe/@/miniapp/trust/${username}`, config);

        const data = (await response.json()) as miniAppUserTrustResponse;

        console.log(`Request to 'https://trust.0xf6.moe/@/miniapp/trust/${username}', result:`, response.status, data, response.headers);
        console.log("Request config", config);
        if (response.status !== 200) {
            console.error("failed")
            return null;
        }

        currentPeriodExecutionCount.value = data.periodData.count;
        currentPeriodExecutionStart.value = (new Date().getTime() - Date.parse(data.periodData.currentExecutionDate));

        return data;
    }
  
    return { currentPeriodExecutionCount, currentPeriodExecutionStart, meId, getMeRequest, hasErrorAuth, hasLoaded, getTrustFor }
})


