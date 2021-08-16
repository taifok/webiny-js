import { Cell, Grid } from "@webiny/ui/Grid";
import { Input } from "@webiny/ui/Input";
import { validation } from "@webiny/validation";
import React from "react";
import { FieldValidator } from "~/admin/contexts/Cms/FieldValidator";

export class MinLengthValidator extends FieldValidator {
    constructor() {
        super("minLength");

        this.setLabel("Min length");
        this.setDescription("Entered value must not be shorter than the provided min length.");
        this.setDefaultMessage("Value is too short.");
        this.setValidator((value, validator) => {
            const minLengthValue = validator.settings.value;
            if (typeof minLengthValue !== "undefined") {
                return validation.validate(value, `minLength:${minLengthValue}`);
            }
        });

        this.setRenderSettings(({ Bind }) => {
            return (
                <Grid>
                    <Cell span={12}>
                        <Bind
                            name={"settings.value"}
                            validators={validation.create("required,numeric")}
                        >
                            <Input
                                type={"number"}
                                label={"Value"}
                                description={"This is the minimum allowed length."}
                            />
                        </Bind>
                    </Cell>
                </Grid>
            );
        });

        this.applyPlugins(MinLengthValidator);
    }
}
