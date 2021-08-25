import tenancy from "@webiny/api-tenancy";
import security, { SecurityIdentity } from "@webiny/api-security";
import personalAccessTokenAuthentication from "@webiny/api-security-admin-users/authentication/personalAccessToken";
import apiKeyAuthentication from "@webiny/api-security-admin-users/authentication/apiKey";
import userAuthorization from "@webiny/api-security-admin-users/authorization/user";
import apiKeyAuthorization from "@webiny/api-security-admin-users/authorization/apiKey";
import anonymousAuthorization from "@webiny/api-security-admin-users/authorization/anonymous";
import { OktaAuthenticationPlugin } from "@webiny/api-security-okta-authentication/OktaAuthenticationPlugin";
import { OktaAssignUserToGroup } from "@webiny/api-security-okta-authentication/OktaAssignUserToGroup";
import { SecurityContext } from "@webiny/api-security/types";
//import cognitoIdentityProvider from "@webiny/api-security-admin-users-cognito";

export default () => [
    /**
     * Security Tenancy API (context, users, groups, tenant links).
     * This will setup the complete GraphQL schema to manage users, groups, access tokens,
     * and provide you with a TenancyContext to access current Tenant data and DB operations.
     */
    tenancy(),

    /**
     * Cognito IDP plugin (hooks for User CRUD methods).
     * This plugin will perform CRUD operations on Cognito when you do something with the user
     * via the UI or API. It's mostly to push changes to Cognito when they happen in your app.
     *
     * It also extends the GraphQL schema with things like "password", which we don't handle
     * natively in our security, but Cognito will handle it for us.
     */
    // cognitoIdentityProvider({
    //     region: process.env.COGNITO_REGION,
    //     userPoolId: process.env.COGNITO_USER_POOL_ID
    // }),

    /**
     * Adds a context plugin to process `security-authentication` plugins.
     * NOTE: this has to be registered *after* the "tenancy" plugins
     * as some of the authentication plugins rely on tenancy context.
     */
    security(),

    /**
     * Authentication plugin for Personal Access Tokens.
     * PATs are directly linked to Users. We consider a token to be valid, if we manage to load
     * a User who owns this particular token. The "identityType" is important, and it has to match
     * the "identityType" configured in the authorization plugin later in this file.
     */
    personalAccessTokenAuthentication({ identityType: "admin" }),

    /**
     * Authentication plugin for API Keys.
     * API Keys are a standalone entity, and are not connected to users in any way.
     * They identify a project, a 3rd party client, not the user.
     * They are used for programmatic API access, CMS data import/export, etc.
     */
    apiKeyAuthentication({ identityType: "api-key" }),

    /**
     * Okta authentication plugin.
     * This plugin will verify the authorization token against a provided issuer and clientId.
     */
    new OktaAuthenticationPlugin({
        clientId: process.env.OKTA_CLIENT_ID,
        issuer: process.env.OKTA_ISSUER,
        getIdentity({ token }) {
            // In Okta, `name` is provided using the `profile` scope and it contains full name.
            const [firstName, lastName] = (token.name || "").split(" ");
            
            // Create an instance of SecurityIdentity 
            return new SecurityIdentity({
                id: token.email,
                type: "admin",
                displayName: token.name,
                // This part stores JWT claims into SecurityIdentity
                firstName,
                lastName,
                group: token.webiny_group
            });
        }
    }),

    /**
     * This plugin hooks into `onLogin` event and links the user with a group specified in the `group` attribute
     * which is taken from `webiny_group` claim (see above).
     */
    new OktaAssignUserToGroup({
        getUserGroupSlug(context: SecurityContext) {
            const identity = context.security.getIdentity();
            // Use the claim value assigned in OktaAuthenticationPlugin.getIdentity
            return identity.group;
        }
    }),

    /**
     * Authorization plugin to fetch permissions for a verified API key.
     * The "identityType" must match the authentication plugin used to load the identity.
     */
    apiKeyAuthorization({ identityType: "api-key" }),

    /**
     * Authorization plugin to load user permissions for requested tenant.
     * The authorization will only be performed on identities whose "type" matches
     * the provided "identityType".
     */
    userAuthorization({ identityType: "admin" }),

    /**
     * Authorization plugin to load permissions for anonymous requests.
     * This allows you to control which API resources can be accessed publicly.
     * The authorization is performed by loading permissions from the "anonymous" user group.
     */
    anonymousAuthorization()
];
