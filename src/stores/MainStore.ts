import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import dayjs from 'dayjs';
import utcSupport from "dayjs/plugin/utc";
import { setUser } from "@sentry/vue";


dayjs.extend(utcSupport);


export interface miniAppUser {
    id: string;
    username: string;
    user_id: number;
    firstLastName: string;
    coins: number;
    last_claimed_coins: string;
}

export interface miniAppUserTrustResponse {
    verdict: "VerifiedStage" | "CertifiedStage" | "PerfectStage" | "GoodStage" | "LowerStage" | "BadStage" | "AwfulStage";
    trust_index: number;
    avatar: { url: string, extensions: string } | null;
    thumbnail: { url: string, extensions: string } | null;
    username: string;
    name: string,
    period_data: { total_coins: number, last_claim_time: string }
}



export const useMainStore = defineStore('main', () => {
    const totalCoins = ref(400)
    const lastClaimTime = ref(0)
    const hasErrorAuth = ref(false)
    const hasLoaded = ref(false)
    const meId = ref('');

    const devUrl = ref("dev_trust.0xf6.moe");
    const prodUrl = ref("trust.0xf6.moe");


    const backendUrl = ref(prodUrl.value);

    function useDevService() {
        backendUrl.value = devUrl.value;
    }
    function useProdService() {
        backendUrl.value = prodUrl.value;
    }

    const isDevelopment = computed(() => backendUrl.value === devUrl.value);

    const countdownTimer = computed(() => 
            dayjs.unix(lastClaimTime.value).utc().add(1, "day").diff(dayjs().utc()));

    async function getMeRequest() {
        if (hasLoaded.value)
            return;

        const config = {headers: { Authorization: (window as any).Telegram.WebApp.initData }};
        const resp = await axios
            .get(`https://${backendUrl.value}/@/miniapp/me`, config);
        console.log(`Request to 'https://${backendUrl.value}/@/miniapp/me', result:`, resp.status, resp.data, resp.headers);
        console.log("Request config", config);
        if (resp.status !== 200) {
            hasErrorAuth.value = true;
            return;
        }
        const user = (resp.data as miniAppUser);

        setUser({
            id: user.id,
            username: user.username
        });

        totalCoins.value = user.coins;
        lastClaimTime.value = +user.last_claimed_coins;

        console.log(`@me result, totalCoins: ${totalCoins.value}, lastClaimTime: ${lastClaimTime.value}`)
        meId.value = user.id;
        hasLoaded.value = true;
    }

    async function shareResult(data: string): Promise<null | "ok"> {
        if (!hasLoaded.value)
            return null;


        function dataURLtoFile(dataurl: any, filename: string) {
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[arr.length - 1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        }

        const form = new FormData();

        form.append("file", dataURLtoFile(data, "rust-report.png"));

        const resp = await axios
            .post(`https://${backendUrl.value}/@/miniapp/trust/share`, form, {
                headers: { 
                    Authorization: (window as any).Telegram.WebApp.initData,
                    'Content-Type': 'multipart/form-data'
                },

            });

        if (!resp)
        {
            console.error("Fetch failed, returned null response");
            return null;
        }
        console.log(`Request to 'https://${backendUrl.value}/@/miniapp/trust/share', result:`, resp.status, resp.data, resp.headers);
        if (resp.status !== 200) {
            console.error("Fetch failed, returned not 200 response");
            return null;
        }

        return "ok";
    }


    async function getTrustFor(username: string): Promise<miniAppUserTrustResponse | "not_found" | "balance_not_enough" | null> {
        if (hasErrorAuth.value)
            return null;
        if (!hasLoaded.value)
            return null;

        const config = {headers: { Authorization: (window as any).Telegram.WebApp.initData }};

        const response = await fetch(`https://${backendUrl.value}/@/miniapp/trust/${username}`, config).catch(() => null);
        if (!response)
        {
            console.error("Fetch failed, returned null response");
            return null;
        }
        console.warn("Requested fetch, status code", response.status);

        if (response.status == 404) {
            return "not_found";
        }
        if (response.status == 422) {
            return "balance_not_enough";
        }

        const data = (await response.json()) as miniAppUserTrustResponse;

        console.log(`Request to 'https://${backendUrl.value}/@/miniapp/trust/${username}', result:`, response.status, data, response.headers);
        console.log("Request config", config);
        if (response.status !== 200) {
            console.error("failed")
            return null;
        }

        totalCoins.value = data.period_data.total_coins;
        lastClaimTime.value = +data.period_data.last_claim_time;

        return data;
    }
  
    return { 
        totalCoins, 
        lastClaimTime, 
        meId, 
        getMeRequest, 
        hasErrorAuth, 
        hasLoaded, 
        getTrustFor, 
        countdownTimer,
        isDevelopment,
        useProdService,
        useDevService,
        backendUrl,
        shareResult
    };
})


