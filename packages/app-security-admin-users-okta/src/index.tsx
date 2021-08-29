import { PluginCollection } from "@webiny/plugins/types";
import { UIViewPlugin } from "@webiny/ui-composer/UIView";
import { UsersFormView } from "@webiny/app-security-admin-users/ui/views/Users/UsersFormView";
import { InputElement } from "@webiny/app-admin/ui/elements/form/InputElement";
import { GroupAutocompleteElement } from "@webiny/app-security-admin-users/ui/elements/GroupAutocompleteElement";

export default (): PluginCollection => {
    return [
        new UIViewPlugin(UsersFormView, view => {
            view.getElement<InputElement>("firstName").setIsDisabled(true);
            view.getElement<InputElement>("lastName").setIsDisabled(true);
            view.getElement<GroupAutocompleteElement>("login").setIsDisabled(true);
            view.getElement<GroupAutocompleteElement>("group").setIsDisabled(true);
            view.getElement("formFooter").remove();
        })
    ];
};
