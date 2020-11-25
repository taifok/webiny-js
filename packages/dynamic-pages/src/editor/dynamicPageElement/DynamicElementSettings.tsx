import * as React from "react";
import { Grid, Cell } from "@webiny/ui/Grid";
import { Select } from "@webiny/ui/Select";
import { plugins } from "@webiny/plugins";
import { connect } from "@webiny/app-page-builder/editor/redux";
import { getPage } from "@webiny/app-page-builder/editor/selectors";

const DynamicElementSettings = ({ Bind, settings }) => {
    const components = plugins.byType("pb-page-element-dynamic-content-component");

    return (
        <React.Fragment>
            <Grid>
                <Cell span={12}>
                    <Bind name={"dataSource"}>
                        <Select label={"Data source"} description={"Select a data source to use"}>
                            {settings.dataSources.map(({ name }) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </Select>
                    </Bind>
                </Cell>
            </Grid>

            <Grid>
                <Cell span={12}>
                    <Bind name={"component"}>
                        <Select
                            label={"Component"}
                            description={"Select a component to render the data"}
                        >
                            {components.map(cmp => (
                                <option key={cmp.name} value={cmp.componentName}>
                                    {cmp.title}
                                </option>
                            ))}
                        </Select>
                    </Bind>
                </Cell>
            </Grid>
        </React.Fragment>
    );
};

export default connect(state => ({ settings: getPage(state).settings }))(DynamicElementSettings);
