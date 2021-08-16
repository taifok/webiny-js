import React from "react";
import styled from "@emotion/styled";
import { Icon } from "@webiny/ui/Icon";
import Draggable from "../Draggable";
import { useCms } from "~/admin/hooks";

const FieldContainer = styled("div")({
    padding: "10px 15px",
    marginBottom: 20,
    display: "flex",
    width: "100%",
    backgroundColor: "var(--mdc-theme-on-background)",
    borderRadius: 15,
    boxSizing: "border-box",
    cursor: "grab",
    opacity: 1,
    transition: "opacity 225ms",
    "&:hover": {
        opacity: 0.8
    },
    "&:last-child": {
        marginBottom: 0
    }
});

const FileInfo = styled("div")({});

const FieldLabel = styled("div")({
    textTransform: "uppercase",
    lineHeight: "145%",
    color: "var(--mdc-theme-on-surface)"
});

const FieldDescription = styled("div")({
    fontSize: 14,
    color: "var(--mdc-theme-text-secondary-on-background)"
});

const FieldHandle = styled("div")({
    marginRight: 15,
    color: "var(--mdc-theme-on-surface)"
});

const Field = ({ onFieldDragStart, fieldType }) => {
    return (
        <Draggable beginDrag={{ type: "newField", fieldType: fieldType.getName() }}>
            {({ drag }) => (
                <div
                    ref={drag}
                    style={{ marginBottom: 10 }}
                    data-testid={`cms-editor-fields-field-${fieldType.getName()}`}
                    onDragStart={onFieldDragStart}
                >
                    <FieldContainer>
                        <FieldHandle>
                            <Icon icon={fieldType.getIcon()} />
                        </FieldHandle>
                        <FileInfo>
                            <FieldLabel>{fieldType.getLabel()}</FieldLabel>
                            <FieldDescription>{fieldType.getDescription()}</FieldDescription>
                        </FileInfo>
                    </FieldContainer>
                </div>
            )}
        </Draggable>
    );
};

export const FieldsSidebar = ({ onFieldDragStart }) => {
    const { app } = useCms();
    const fields = app.getFieldTypes();

    return (
        <React.Fragment>
            {fields.map(fieldType => (
                <Field
                    key={fieldType.getName()}
                    fieldType={fieldType}
                    onFieldDragStart={onFieldDragStart}
                />
            ))}
        </React.Fragment>
    );
};
