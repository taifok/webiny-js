import fetch from "node-fetch";

type DataSourceSettings = {
    // "type" refers to the type of data source (CMS, REST, etc. This comes from the data source plugin).
    type: string;
    // A name of the data-source, which will be useful in the UI and to reference the dataset.
    name: string;
    // Configuration of the datasource.
    config: Record<string, any>;
};

export const loadDataSources = async (
    settings: DataSourceSettings[],
    variables: Record<string, any>
) => {
    const dataSources = [];

    for (let i = 0; i < settings.length; i++) {
        const { name, config } = settings[i];
        try {
            const withValues = JSON.parse(
                Object.keys(variables).reduce((string, key) => {
                    return string.replace(`{${key}}`, variables[key]);
                }, config.variables)
            );

            const withHeaders = JSON.parse(config.headers);

            const { data } = await fetch(config.url, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...withHeaders },
                body: JSON.stringify({ query: config.query, variables: withValues })
            }).then(res => res.json());

            dataSources.push({ name, data });
        } catch (err) {
            console.log(`Error while loading "${name}" datasource`, err);
        }
    }

    return dataSources;
};
