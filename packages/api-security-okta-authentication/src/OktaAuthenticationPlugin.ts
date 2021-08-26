import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import fetch from "node-fetch";
import util from "util";
import { SecurityIdentity } from "@webiny/api-security";
import Error from "@webiny/error";
import { HttpContext } from "@webiny/handler-http/types";
import { Context as HandlerContext } from "@webiny/handler/types";
import { AuthenticationPlugin } from "@webiny/api-security/plugins/AuthenticationPlugin";
const verify = util.promisify<string, string, Record<string, any>>(jwt.verify);

// All JWTs are split into 3 parts by two periods
const isJwt = token => token.split(".").length === 3;

type Context = HandlerContext<HttpContext>;

export interface Config {
    issuer: string;
    clientId: string;
    getIdentity(params: { token: { [key: string]: any } }, context: Context): SecurityIdentity;
}

const jwksCache = new Map<string, Record<string, any>[]>();

export class OktaAuthenticationPlugin extends AuthenticationPlugin {
    private _config: Config;

    constructor(config: Config) {
        super();
        this._config = config;
    }

    async authenticate(context: Context): Promise<SecurityIdentity | undefined> {
        const { method: httpMethod, headers = {} } = context.http.request;
        let idToken = headers["Authorization"] || headers["authorization"] || "";

        if (!idToken) {
            return;
        }

        idToken = idToken.replace(/bearer\s/i, "");

        if (isJwt(idToken) && httpMethod === "POST") {
            try {
                const jwks = await this.getJWKs();
                const { header } = jwt.decode(idToken, { complete: true });
                const jwk = jwks.find(key => key.kid === header.kid);

                if (!jwk) {
                    return;
                }

                const token = await verify(idToken, jwkToPem(jwk));
                if (!token.jti.startsWith("ID.")) {
                    throw new Error("idToken is invalid!", "SECURITY_OKTA_INVALID_TOKEN");
                }

                return this._config.getIdentity({ token }, context);
            } catch (err) {
                console.log("OktaAuthenticationPlugin", err);
                throw new Error(err.message, "SECURITY_OKTA_INVALID_TOKEN");
            }
        }
    }

    private getJWKsURL() {
        return `${this._config.issuer}/v1/keys`;
    }

    private async getJWKs() {
        const key = this._config.issuer;

        if (!jwksCache.has(key)) {
            const response = await fetch(this.getJWKsURL()).then(res => res.json());
            jwksCache.set(key, response.keys);
        }

        return jwksCache.get(key);
    }
}
