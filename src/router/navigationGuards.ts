import { useAppStore } from "@/store/app";
import { OAuthRespose } from "@/util/oauth";
import { withErrorMessage } from "@/util/withErrorMessage";
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
            const tokenResponse: OAuthRespose = await withErrorMessage(
                async () =>
                    (
                        await axios.post("/auth/oauth/token", {
                            grant_type: "authorization_code",
                            client_id: "gropius-auth-client",
                            code: oauthCode,
                            code_verifier: store.codeVerifier
                        })
                    ).data,
                "Could not login."
            );
            await store.setNewTokenPair(tokenResponse.access_token, tokenResponse.refresh_token);

            const next = store.redirectTo;
            store.redirectTo = "";
            return {
                ...router.resolve(next),
                replace: true
            };
        } catch (err) {
            console.log(err);
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
    return await authorizeIfRequired(to);
}

async function authorizeIfRequired(to: RouteLocationNormalized) {
    const store = useAppStore();
    if (!(await store.isLoggedIn())) {
        store.redirectTo = to.fullPath;
        return {
            name: "login"
        };
    } else {
        await store.validateUser();
    }
    return true;
}
