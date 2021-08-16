import React from "react";
import { FormRenderPropParams } from "@webiny/form";
import { CmsEditorContentModel } from "~/types";
import { FieldValidator } from "./FieldValidator";
import { ApplyFunction, Class, ClassPlugin, Pluginable } from "./Pluginable";

export interface QueryFieldParams {
    field: CmsEditorField;
}

export interface CmsEditorFieldPredefinedValuesEntry {
    label: string;
    value: string;
}

export interface CmsEditorFieldPredefinedValues {
    enabled: boolean;
    values: CmsEditorFieldPredefinedValuesEntry[];
}

export interface CmsEditorFieldValidator {
    name: string;
    message: string;
    settings: any;
}

export type CmsEditorField<T = unknown> = T & {
    id?: string;
    type: string;
    fieldId?: string;
    label?: string;
    helpText?: string;
    placeholderText?: string;
    validation?: CmsEditorFieldValidator[];
    listValidation?: CmsEditorFieldValidator[];
    multipleValues?: boolean;
    predefinedValues?: CmsEditorFieldPredefinedValues;
    settings?: { [key: string]: any };
    renderer: {
        name: string;
    };
};

export interface FieldTypeConfig {
    /**
     * Field type name.
     */
    name?: string;
    /**
     * A display name for the field.
     */
    label?: string;
    /**
     * A list of available validators for the model field.
     */
    validators?: FieldValidator[];
    /**
     * A list of available validators when a model field accepts a list (array) of values.
     */
    listValidators?: FieldValidator[];
    /**
     * An explanation of the field displayed beneath the field.
     */
    description?: string;
    /**
     * A ReactNode to display the icon for the field.
     */
    icon?: React.ReactNode;
    /**
     * Is it allowed to have multiple values in this field?
     */
    allowMultipleValues?: boolean;
    /**
     * Does this field type have a fixed list of values that can be selected?
     */
    allowPredefinedValues?: boolean;
    /**
     * A ReactNode label when multiple values are enabled.
     */
    multipleValuesLabel?: React.ReactNode;
    /**
     * These are the default values when the field is first created. This is a representation of the field that is stored in the database.
     */
    createField?: () => CmsEditorField;
    /**
     * A ReactNode that you can add in the section below the help text when creating/editing field.
     */
    renderSettings?: (params: {
        form: FormRenderPropParams;
        afterChangeLabel: (value: string) => void;
        uniqueFieldIdValidator: (fieldId: string) => void;
        contentModel: CmsEditorContentModel;
    }) => React.ReactNode;
    /**
     * A ReactNode that renders in the Predefined values tab.
     */
    renderPredefinedValues?: (params: {
        form: FormRenderPropParams;
        getBind: (index?: number) => any;
    }) => React.ReactNode;
    /**
     * Object wrapper for GraphQL stuff
     */
    graphql?: {
        /**
         * Define field selection.
         *
         * ```ts
         * graphql: {
         *     queryField: `
         *         {
         *             id
         *             title
         *             createdOn
         *         }
         *     `,
         * }
         * ```
         */
        queryField?: string | ((params: QueryFieldParams) => string);
    };
    render?(params: any): React.ReactElement;
}

export class FieldType extends Pluginable {
    private _config: FieldTypeConfig = {};

    constructor(name: string) {
        super();

        this._config.name = name;
    }

    applyPlugins(type: Class<FieldType>) {
        super.applyPlugins(FieldType);
        super.applyPlugins(type);
    }

    getName() {
        return this._config.name;
    }

    addValidator(validator: FieldValidator) {
        if (!Array.isArray(this._config.validators)) {
            this._config.validators = [];
        }
        this._config.validators.push(validator);
    }

    addListValidator(validator: FieldValidator) {
        if (!Array.isArray(this._config.listValidators)) {
            this._config.listValidators = [];
        }

        this._config.listValidators.push(validator);
    }

    getLabel() {
        return this._config.label;
    }

    setLabel(label: string) {
        this._config.label = label;
    }

    getValidators() {
        return this._config.validators || [];
    }

    setValidators(validators: FieldValidator[]) {
        this._config.validators = validators;
    }

    getListValidators() {
        return this._config.listValidators || [];
    }

    setListValidators(validators: FieldValidator[]) {
        this._config.listValidators = validators;
    }

    getDescription() {
        return this._config.description;
    }

    setDescription(description: string) {
        this._config.description = description;
    }

    getIcon() {
        return this._config.icon;
    }

    setIcon(icon: React.ReactNode) {
        this._config.icon = icon;
    }

    getAllowMultipleValues() {
        return this._config.allowMultipleValues;
    }

    setAllowMultipleValues(allow: boolean) {
        this._config.allowMultipleValues = allow;
    }

    getAllowPredefinedValues() {
        return this._config.allowPredefinedValues;
    }

    setAllowPredefinedValues(allow: boolean) {
        this._config.allowPredefinedValues = allow;
    }

    getMultipleValuesLabel() {
        return this._config.multipleValuesLabel;
    }

    setMultipleValuesLabel(label: React.ReactNode) {
        this._config.multipleValuesLabel = label;
    }

    getCreateField() {
        return this._config.createField || this.defaultCreateField.bind(this);
    }

    setCreateField(createField: FieldTypeConfig["createField"]) {
        this._config.createField = createField;
    }

    getRenderSettings() {
        return this._config.renderSettings;
    }

    setRenderSettings(renderSettings: FieldTypeConfig["renderSettings"]) {
        this._config.renderSettings = renderSettings;
    }

    getRenderPredefinedValues() {
        return this._config.renderPredefinedValues;
    }

    setRenderPredefinedValues(render: FieldTypeConfig["renderPredefinedValues"]) {
        this._config.renderPredefinedValues = render;
    }

    getGraphql() {
        return this._config.graphql;
    }

    setGraphql(graphql: FieldTypeConfig["graphql"]) {
        this._config.graphql = graphql;
    }

    getRender() {
        return this._config.render;
    }

    setRender(render: FieldTypeConfig["render"]) {
        this._config.render = render;
    }

    createField() {
        return this.getCreateField()();
    }

    renderSettings(params: Parameters<FieldTypeConfig["renderSettings"]>[0]) {
        const renderSettings = this.getRenderSettings();
        return renderSettings ? renderSettings(params) : null;
    }

    renderPredefinedValues(params: Parameters<FieldTypeConfig["renderPredefinedValues"]>[0]) {
        return this.getRenderPredefinedValues()(params);
    }

    render(params: FieldTypeConfig["render"]) {
        const render = this.getRender();
        return render ? render(params) : null;
    }

    private defaultCreateField() {
        return {
            type: this.getName(),
            validation: [],
            renderer: {
                name: ""
            }
        };
    }
}

export class FieldTypePlugin<TClass extends FieldType> extends ClassPlugin<TClass> {
    constructor(fieldClass: Class<TClass>, apply: ApplyFunction<TClass>) {
        super(fieldClass, apply);
    }
}
