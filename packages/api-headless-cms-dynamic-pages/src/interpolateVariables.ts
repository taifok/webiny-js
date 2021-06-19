import { get } from "dot-prop-immutable";

function convertToType(value, type) {
    switch (type) {
        case "Number":
            return value.includes(".") ? parseFloat(value) : parseInt(value);
        case "Boolean":
            return value === "true";
        default:
            return value;
    }
}

export function interpolateVariables(variables, values) {
    return variables.reduce((all, variable) => {
        let value = variable.value;
        if (value.includes("${")) {
            const matches = Array.from(variable.value.matchAll(/\${([a-zA-Z.]+)}/g));
            for (const match of matches) {
                // Try getting value from passed values and use `previewValue` as a fallback.
                // `previewValue` is configured in the Page Builder editor data source settings.
                value = value.replace(match[0], get(values, match[1], variable.previewValue));
            }
            all[variable.name] = value;
        } else {
            all[variable.name] = convertToType(value, variable.type);
        }

        return all;
    }, {});
}
