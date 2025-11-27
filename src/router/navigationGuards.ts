import { useAppStore } from "@/store/app";
import { buildOAuthUrl, OAuthRespose, TokenScope } from "@/util/oauth";
import axios from "axios";
import { RouteLocationNormalized, RouteLocationRaw } from "vue-router";
import router from "@/router/index";

export async function onLoginEnter(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean> {
    const oauthCode = to.query["code"] ?? "";
    const store = useAppStore();

    if (oauthCode !== undefined && oauthCode.length > 0) {
        try {
            const tokenResponse: OAuthRespose = (
                await axios.post("/auth/oauth/token", {
                    grant_type: "authorization_code",
                    client_id: "gropius-auth-client",
                    code: oauthCode,
                    code_verifier: store.codeVerifier
                })
            ).data;
            await store.setNewTokenPair(tokenResponse.access_token, tokenResponse.refresh_token);

            const redirectTo = store.redirectTo;
            store.redirectTo = "";
            return {
                ...router.resolve(redirectTo),
                replace: true
            };
        } catch (err: any) {
            console.log(err);
            store.pushError("Could not login");
            return {
                name: "home",
                replace: true
            };
        }
    }

    return true;
}

export async function onAnyEnter(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean> {
    if (to.name == "login") {
        return true;
    }
    const result = await authorizeIfRequired(to);
    if (from.name !== to.name && result === true) {
        useAppStore().validateLegalInformation();
    }
    return result;
}

export async function authorizeIfRequired(to: RouteLocationNormalized): Promise<boolean> {
    const store = useAppStore();
    if (!(await store.isLoggedIn())) {
        window.location.href = await buildOAuthUrl([TokenScope.LOGIN_SERVICE, TokenScope.BACKEND], to.fullPath);
        return false;
    } else {
        await store.validateUser();
    }
    return true;
}
