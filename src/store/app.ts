import { defineStore } from "pinia";
import axios from "axios";
import { useLocalStorage } from "@vueuse/core";
import { jwtDecode } from "jwt-decode";
import { pushErrorMessage } from "@/util/withErrorMessage";
import { ClientReturnType, useClient } from "@/graphql/client";
import { Mutex } from "async-mutex";
import { shallowRef } from "vue";
import { TokenScope } from "@/util/oauth";

export interface GlobalUserPermissions {
    canCreateProjects: boolean;
    canCreateComponents: boolean;
    canCreateIMSs: boolean;
    canCreateTemplates: boolean;
}

export const useAppStore = defineStore("app", {
    state: () => ({
        tokenRefreshLock: shallowRef(new Mutex()),
        accessTokenLock: shallowRef(new Mutex()),
        user: undefined as undefined | (ClientReturnType<"getCurrentUser">["currentUser"] & GlobalUserPermissions),
        accessToken: "",
        refreshToken: "",
        accessTokenValidUntil: 0,
        codeVerifier: useLocalStorage<string>("gropiusFrontend__codeVerifier", ""),
        errors: [] as string[],
        visibleTimelineItems: useLocalStorage<number[]>("gropiusFrontend__visibleTimelineItems", [0, 1] as number[]),

        // Whether the user has manually logged out. This is used to prevent automatic logins.
        manuallyLoggedOut: useLocalStorage<boolean>("gropiusFrontend__manuallyLoggedOut", false),

        // The path the user should be redirected to after a successful login
        redirectTo: useLocalStorage<string>("gropiusFrontend__redirectTo", "")
    }),
    getters: {
        tokenValidityDuration(): number {
            if (!this.accessToken) {
                return 0;
            }
            const payload = jwtDecode(this.accessToken);
            const exp = payload.exp;
            if (exp === undefined) {
                return Infinity;
            }
            const nbf = payload.nbf ?? payload.iat ?? Date.now() / 1000;
            return (exp - nbf) * 1000;
        }
    },
    actions: {
        async setNewTokenPair(accessToken: string, refreshToken: string): Promise<void> {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.manuallyLoggedOut = false;
            await this.validateUser();
        },
        async logout(): Promise<void> {
            this.accessToken = "";
            this.refreshToken = "";
            this.manuallyLoggedOut = true;
            this.redirectTo = undefined;
        },
        async validateUser(): Promise<void> {
            if (!(await this.isLoggedIn())) {
                this.user = undefined;
            } else {
                const client = useClient();
                const userRes = await client.getCurrentUser();
                if (userRes.currentUser != undefined) {
                    this.user = {
                        ...userRes.currentUser,
                        canCreateProjects: userRes.canCreateProjects,
                        canCreateComponents: userRes.canCreateComponents,
                        canCreateIMSs: userRes.canCreateIMSs,
                        canCreateTemplates: userRes.canCreateTemplates
                    };
                } else {
                    this.user = undefined;
                }
            }
        },
        async forceTokenRefresh(): Promise<void> {
            await this.tokenRefreshLock.runExclusive(async () => {
                try {
                    if (this.refreshToken) {
                        const tokenResponse = (
                            await axios.post("/auth/oauth/token", {
                                grant_type: "refresh_token",
                                refresh_token: this.refreshToken,
                                client_id: "gropius-auth-client"
                            })
                        ).data;
                        this.accessToken = tokenResponse.access_token;
                        this.refreshToken = tokenResponse.refresh_token;
                        this.accessTokenValidUntil = this.tokenValidityDuration + Date.now() - 30 * 1000;
                    }
                } catch {
                    this.accessToken = "";
                    this.refreshToken = "";
                    pushErrorMessage("Could not refresh access token.");
                }
            });
        },
        async getAccessToken(): Promise<string | undefined> {
            return await this.accessTokenLock.runExclusive(async () => {
                if (!this.refreshToken || !this.accessToken) {
                    return undefined;
                }
                const decoded = jwtDecode(this.accessToken);
                if (
                    (decoded.exp != undefined && decoded.exp * 1000 - Date.now() < 30 * 1000) ||
                    this.accessTokenValidUntil < Date.now()
                ) {
                    try {
                        await this.forceTokenRefresh();
                    } catch (err) {
                        return undefined;
                    }
                }
                return this.accessToken!;
            });
        },
        async isLoggedIn(): Promise<boolean> {
            try {
                return (await this.getValidTokenScopes()).includes(TokenScope.BACKEND);
            } catch {
                return false;
            }
        },
        async getValidTokenScopes(): Promise<TokenScope[]> {
            try {
                const token = await this.getAccessToken();
                if (token == undefined) {
                    return [];
                }
                const payload = jwtDecode(token);
                const audience = payload.aud;
                if (typeof audience == "string") {
                    return [audience as TokenScope];
                }
                return audience as TokenScope[];
            } catch {
                return [];
            }
        },
        pushError(error: string) {
            this.errors = [...this.errors, error];
        },
        popError(): string | undefined {
            return this.errors.pop();
        }
    }
});
