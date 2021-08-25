import { UserPlugin } from "@webiny/api-security-admin-users/plugins/UserPlugin";
import { SecurityContext } from "@webiny/api-security/types";

export interface Config {
    getUserGroupSlug(context: SecurityContext): string;
}

export class OktaAssignUserToGroup extends UserPlugin {
    private config: Config;

    constructor(config: Config) {
        super();
        this.config = config;
    }

    async onLogin({ firstLogin, user, context }) {
        // Link user to group on first login
        if (!firstLogin) {
            return;
        }

        const groupSlug = this.config.getUserGroupSlug(context);
        let group = await context.security.groups.getGroup(groupSlug, { auth: false });

        if (!group) {
            group = await context.security.groups.getGroup("anonymous", { auth: false });
        }

        await context.security.users.linkUserToTenant(
            user.id,
            context.tenancy.getCurrentTenant(),
            group
        );
    }
}
