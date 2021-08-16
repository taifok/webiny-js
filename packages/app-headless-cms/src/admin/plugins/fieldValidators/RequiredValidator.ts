import { validation } from "@webiny/validation";
import { FieldValidator } from "~/admin/contexts/Cms/FieldValidator";

export class RequiredValidator extends FieldValidator {
    constructor() {
        super("required");

        this.setLabel("Required");
        this.setDescription("You won't be able to submit the form if this field is empty");
        this.setDefaultMessage("Value is required.");
        this.setValidator(value => {
            return validation.validate(value, "required");
        });

        this.applyPlugins(RequiredValidator);
    }
}
