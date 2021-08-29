import adminUsers from "@webiny/app-security-admin-users/plugins";
import accountDetails from "@webiny/app-security-admin-users/plugins/userMenu/accountDetails";
import signOut from "@webiny/app-security-admin-users/plugins/userMenu/signOut";
import userImage from "@webiny/app-security-admin-users/plugins/userMenu/userImage";
import userInfo from "@webiny/app-security-admin-users/plugins/userMenu/userInfo";
import adminUsersOkta from "@webiny/app-security-admin-users-okta";

export default [
    /**
     * Add user management module to admin app.
     */
    adminUsers(),
    /**
     * User menu plugins
     */
    accountDetails(),
    signOut(),
    userImage(),
    userInfo(),
    adminUsersOkta()
];
