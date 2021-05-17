import { Plugin } from "@webiny/plugins/types";
import { Context } from "@webiny/handler/types";

export interface SecurityIdentity {
    id: string;
    displayName: string;
    type: string;
    [key: string]: any;
};

export interface SecurityAuthenticationPlugin extends Plugin {
    type: "security-authentication";
    authenticate(context: Context): Promise<null | SecurityIdentity>;
};

export interface SecurityPermission {
    name: string;
    [key: string]: any;
}

export interface SecurityAuthorizationPlugin extends Plugin {
    type: "security-authorization";
    getPermissions(context: SecurityContext): Promise<SecurityPermission[]>;
}

export interface SecurityContextBase {
    getIdentity: () => SecurityIdentity;
    getPermission: <TSecurityPermission = SecurityPermission>(
        name: string
    ) => Promise<TSecurityPermission>;
    getPermissions(): Promise<SecurityPermission[]>;
    hasFullAccess(): Promise<boolean>;
}

export interface SecurityContext extends Context {
    security: SecurityContextBase;
}

export interface FullAccessPermission {
    name: "*";
}
