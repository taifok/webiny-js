import React from "react";
import { css } from "emotion";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton,
    DialogCancel
} from "@webiny/ui/Dialog";
import { Input } from "@webiny/ui/Input";
import { Grid, Cell } from "@webiny/ui/Grid";
import { Form, FormOnSubmit } from "@webiny/form";
import { validation } from "@webiny/validation";
import { Select } from "@webiny/ui/Select/Select";

const narrowDialog = css({
    ".mdc-dialog__surface": {
        width: 600,
        minWidth: 600
    }
});

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: FormOnSubmit;
};

export const SelectDataSource = (props: Props) => {
    const { open, onSubmit, onClose } = props;

    return (
        <Dialog open={open} className={narrowDialog} onClose={onClose}>
            <Form onSubmit={onSubmit} data={{ dataSource: null, path: "" }}>
                {({ submit, Bind }) => (
                    <React.Fragment>
                        <DialogTitle>Use Data Source</DialogTitle>
                        <DialogContent>
                            <Grid>
                                <Cell span={12}>
                                    <Bind
                                        name={"dataSource"}
                                        validators={validation.create("required")}
                                    >
                                        <Select label={`Data Source`}>
                                            <option value={"get-entry"}>
                                                Headless CMS - Get Entry
                                            </option>
                                            <option value={"graphql#1"}>Custom GraphQL</option>
                                        </Select>
                                    </Bind>
                                </Cell>
                                <Cell span={12}>
                                    <Bind name={"path"} validators={validation.create("required")}>
                                        <Input label={"Path"} autoFocus />
                                    </Bind>
                                </Cell>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <DialogCancel>Cancel</DialogCancel>
                            <DialogButton onClick={submit}>Save</DialogButton>
                        </DialogActions>
                    </React.Fragment>
                )}
            </Form>
        </Dialog>
    );
};
