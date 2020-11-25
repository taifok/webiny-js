import * as React from "react";
import DataSources from "./DataSources";

const DataSourcesSettings = ({ Bind }) => {
    return (
        <Bind name={"settings.dataSources"} defaultValue={[]}>
            {props => <DataSources prefix={"settings.dataSources"} Bind={Bind} {...props} />}
        </Bind>
    );
};

export default DataSourcesSettings;
