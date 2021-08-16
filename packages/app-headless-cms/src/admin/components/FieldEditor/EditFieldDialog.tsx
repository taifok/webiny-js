import React, { useState, useEffect, useCallback } from "react";
import { cloneDeep } from "lodash";
import { css } from "emotion";
import { Dialog, DialogContent, DialogTitle, DialogActions, DialogButton } from "@webiny/ui/Dialog";
import { Form } from "@webiny/form";
import { Tabs, Tab } from "@webiny/ui/Tabs";
import { i18n } from "@webiny/app/i18n";
import { CmsEditorField, CmsEditorFieldRendererPlugin } from "~/types";
import { plugins } from "@webiny/plugins";
import GeneralTab from "./EditFieldDialog/GeneralTab";
import AppearanceTab from "./EditFieldDialog/AppearanceTab";
import PredefinedValues from "./EditFieldDialog/PredefinedValues";
import ValidatorsTab from "./EditFieldDialog/ValidatorsTab";
import { Grid, Cell } from "@webiny/ui/Grid";
import { Typography } from "@webiny/ui/Typography";
import { Elevation } from "@webiny/ui/Elevation";
import { useFieldEditor } from "~/admin/components/FieldEditor/useFieldEditor";

const t = i18n.namespace("app-headless-cms/admin/components/editor");

const dialogBody = css({
    "&.webiny-ui-dialog__content": {
        width: 875,
        height: 450
    }
});

type EditFieldDialogProps = {
    field: CmsEditorField;
    onClose: Function;
    onSubmit: (data: any) => void;
};

const fieldEditorDialog = css({
    width: "100vw",
    height: "100vh",
    ".mdc-dialog__surface": {
        maxWidth: "100% !important",
        maxHeight: "100% !important",
        ".webiny-ui-dialog__content": {
            maxWidth: "100% !important",
            maxHeight: "100% !important",
            width: "100vw",
            height: "calc(100vh - 155px)",
            paddingTop: "0 !important"
        }
    }
});

const EditFieldDialog = ({ field, onSubmit, ...props }: EditFieldDialogProps) => {
    const [current, setCurrent] = useState(null);

    const { getFieldType } = useFieldEditor();

    useEffect(() => {
        if (!field) {
            return setCurrent(field);
        }

        const clonedField = cloneDeep(field);

        if (!clonedField.renderer || !clonedField.renderer.name) {
            const [renderPlugin] = plugins
                .byType<CmsEditorFieldRendererPlugin>("cms-editor-field-renderer")
                .filter(item => item.renderer.canUse({ field }));

            if (renderPlugin) {
                clonedField.renderer = { name: renderPlugin.renderer.rendererName };
            }
        }

        setCurrent(clonedField);
    }, [field]);

    const onClose = useCallback(() => {
        setCurrent(null);
        props.onClose();
    }, undefined);

    let render = null;
    let headerTitle = t`Field Settings`;

    if (current) {
        const fieldType = getFieldType(current.type);
        if (fieldType) {
            headerTitle = t`Field Settings - {fieldTypeLabel}`({
                fieldTypeLabel: fieldType.getLabel()
            });
        }

        render = (
            <Form data={current} onSubmit={onSubmit}>
                {form => {
                    const predefinedValuesTabEnabled =
                        fieldType.getAllowPredefinedValues() &&
                        form.data.predefinedValues &&
                        form.data.predefinedValues.enabled;

                    return (
                        <>
                            <DialogContent className={dialogBody}>
                                <Tabs>
                                    <Tab label={t`General`}>
                                        <GeneralTab
                                            form={form}
                                            field={form.data as CmsEditorField}
                                            fieldType={fieldType}
                                        />
                                    </Tab>
                                    <Tab
                                        label={t`Predefined Values`}
                                        disabled={!predefinedValuesTabEnabled}
                                    >
                                        {predefinedValuesTabEnabled && (
                                            <PredefinedValues
                                                form={form}
                                                field={form.data as CmsEditorField}
                                                fieldPlugin={fieldType}
                                            />
                                        )}
                                    </Tab>

                                    {form.data.multipleValues && (
                                        <Tab
                                            label={"Validators"}
                                            data-testid={"cms.editor.field.tabs.validators"}
                                        >
                                            <Grid>
                                                <Cell span={12}>
                                                    <Typography use={"headline5"}>
                                                        List validators
                                                    </Typography>
                                                    <br />
                                                    <Typography use={"body2"}>
                                                        These validators are applied to the entire
                                                        list of values.
                                                    </Typography>
                                                </Cell>
                                                <Cell span={12}>
                                                    <Elevation z={2}>
                                                        <ValidatorsTab
                                                            field={field}
                                                            name={"listValidation"}
                                                            validators={fieldType.getListValidators()}
                                                            form={form}
                                                        />
                                                    </Elevation>
                                                </Cell>
                                            </Grid>

                                            <Grid>
                                                <Cell span={12}>
                                                    <Typography use={"headline5"}>
                                                        Individual value validators
                                                    </Typography>
                                                    <br />
                                                    <Typography use={"body2"}>
                                                        These validators are applied to each value
                                                        in the list.
                                                    </Typography>
                                                </Cell>
                                                <Cell span={12}>
                                                    <Elevation z={2}>
                                                        <ValidatorsTab
                                                            field={current}
                                                            form={form}
                                                            name={"validation"}
                                                            validators={fieldType.getValidators()}
                                                        />
                                                    </Elevation>
                                                </Cell>
                                            </Grid>
                                        </Tab>
                                    )}

                                    {!form.data.multipleValues &&
                                        fieldType.getValidators().length > 0 && (
                                            <Tab
                                                label={"Validators"}
                                                data-testid={"cms.editor.field.tabs.validators"}
                                            >
                                                <ValidatorsTab
                                                    field={current}
                                                    form={form}
                                                    name={"validation"}
                                                    validators={fieldType.getValidators()}
                                                />
                                            </Tab>
                                        )}
                                    <Tab label={t`Appearance`}>
                                        <AppearanceTab
                                            form={form}
                                            field={form.data as CmsEditorField}
                                            fieldPlugin={fieldType}
                                        />
                                    </Tab>
                                </Tabs>
                            </DialogContent>
                            <DialogActions
                                style={{
                                    justifyContent: "flex-end"
                                }}
                            >
                                <div>
                                    <DialogButton onClick={onClose}>{t`Cancel`}</DialogButton>
                                    <DialogButton onClick={form.submit}>{t`Save`}</DialogButton>
                                </div>
                            </DialogActions>
                        </>
                    );
                }}
            </Form>
        );
    }

    return (
        <Dialog
            preventOutsideDismiss
            open={!!current}
            onClose={onClose}
            data-testid={"cms-editor-edit-fields-dialog"}
            className={fieldEditorDialog}
        >
            <DialogTitle>{headerTitle}</DialogTitle>
            {render}
        </Dialog>
    );
};

export default EditFieldDialog;
