import graphql from "./graphql";
import upgrades from "./upgrades";
import triggerHandlers from "./triggers/triggerHandlers";
import validators from "./validators";
import formsGraphQL from "./graphql/form";
import formSettingsGraphQL from "./graphql/formSettings";
import { FormBuilder } from "../FormBuilder";
import { ApiFormBuilderContext } from "../types";
import {ContextPlugin} from "@webiny/handler/plugins/ContextPlugin";

export default () => [
    graphql,
    upgrades,
    triggerHandlers,
    validators,
    formsGraphQL,
    formSettingsGraphQL,
    new ContextPlugin<ApiFormBuilderContext>(context => {
        const tenant = context.tenancy.getCurrentTenant().id;
        const locale = context.i18n.getCurrentLocale().code;
        const { security, plugins } = context;

        context.formBuilder = new FormBuilder({
            locale,
            tenant,
            security, // TODO: @pavel should be an instance of the Security class
            plugins, // TODO: @pavel something to check out further maybe
            webinyVersion: context.WEBINY_VERSION
        });
    })
];
