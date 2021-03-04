import {Cell, Grid} from "@webiny/ui/Grid";
import {Input} from "@webiny/ui/Input";
import React from "react";
import { validation } from "@webiny/validation"

const UserReference = (props) => {
    const { Bind } = props;
    return (
        <Grid>
            <Cell span={12}>
                <Bind name={"placeholderText"}>
                    <Input
                        label={"User Reference"}
                        description={"This is a field to reference users. Please enter the Email addresses of users able to edit the content model it's attached to."}
                        validation={validation.create("email")}
                    />
                </Bind>
            </Cell>
        </Grid>
    )};


export default UserReference;
