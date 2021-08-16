import { FieldValidator, ValidatorConfig } from "~/admin/contexts/Cms/FieldValidator";

export const createValidators = (validators: FieldValidator[], validation: ValidatorConfig[]) => {
    return validation
        .map(item => {
            const validator = validators.find(v => v.getName() === item.name);
            if (!validator) {
                return;
            }

            const validationFunction = validator.getValidator();

            return async value => {
                let isInvalid;
                try {
                    const result = await validationFunction(value, item);
                    isInvalid = result === false;
                } catch (e) {
                    isInvalid = true;
                }

                if (isInvalid) {
                    throw new Error(item.message || "Invalid value.");
                }
            };
        })
        .filter(Boolean);
};
