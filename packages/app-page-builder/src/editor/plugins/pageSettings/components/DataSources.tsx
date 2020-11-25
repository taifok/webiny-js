import * as React from "react";
import { trim } from "lodash";
import { DynamicFieldset } from "@webiny/ui/DynamicFieldset";
import { ButtonPrimary, ButtonSecondary } from "@webiny/ui/Button";
import { Grid, Cell } from "@webiny/ui/Grid";
import { Input } from "@webiny/ui/Input";
import { Typography } from "@webiny/ui/Typography";
import { css } from "emotion";
import { validation } from "@webiny/validation";
import { BindComponent } from "@webiny/form/Bind";
import { CodeEditor } from "@webiny/ui/CodeEditor";
import "brace/mode/json";
import "brace/mode/graphqlschema";
import "brace/theme/github";

type Props = {
    prefix: string;
    value: Array<{ [key: string]: string }>;
    onChange: Function;
    Bind: BindComponent;
};

const controlButtons = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ">button": {
        marginRight: 15
    }
});

const textStyling = css({
    color: "var(--mdc-theme-text-secondary-on-background)"
});

const DataSources = ({ prefix, value, onChange, Bind, ...other }: Props) => {
    return (
        <DynamicFieldset value={value} onChange={onChange} {...other}>
            {({ actions, row, empty }) => (
                <React.Fragment>
                    {row(({ index }) => (
                        <Grid>
                            <Cell span={12}>
                                <Bind
                                    name={`${prefix}.${index}.name`}
                                    validators={validation.create("required")}
                                    beforeChange={(tag, cb) => cb(trim(tag))}
                                >
                                    <Input label={"Name"} />
                                </Bind>
                            </Cell>
                            <Cell span={12}>
                                <Bind
                                    name={`${prefix}.${index}.config.url`}
                                    validators={validation.create("required")}
                                >
                                    <Input label={"GraphQL URL"} />
                                </Bind>
                            </Cell>
                            <Cell span={12}>
                                <Bind
                                    name={`${prefix}.${index}.config.query`}
                                >
                                    <CodeEditor
                                        height={"300px"}
                                        mode="graphqlschema"
                                        theme="github"
                                        description={"Type your GraphQL query here"}
                                    />
                                </Bind>
                            </Cell>
                            <Cell span={12}>
                                <Bind
                                    name={`${prefix}.${index}.config.variables`}
                                >
                                    <CodeEditor
                                        height={"100px"}
                                        mode="json"
                                        theme="github"
                                        description={"Type your query variables here"}
                                    />
                                </Bind>
                            </Cell>
                            <Cell span={12} className={controlButtons}>
                                <ButtonPrimary small onClick={actions.add(index)}>
                                    +
                                </ButtonPrimary>
                                <ButtonSecondary small onClick={actions.remove(index)}>
                                    -
                                </ButtonSecondary>
                            </Cell>
                        </Grid>
                    ))}
                    {empty(() => (
                        <Grid>
                            <Cell span={12} className={textStyling}>
                                <Typography use={"button"}>
                                    To add another Data Source, click{" "}
                                    <ButtonPrimary onClick={actions.add()}>
                                        Add Data Source
                                    </ButtonPrimary>
                                </Typography>
                            </Cell>
                        </Grid>
                    ))}
                </React.Fragment>
            )}
        </DynamicFieldset>
    );
};

export default DataSources;
