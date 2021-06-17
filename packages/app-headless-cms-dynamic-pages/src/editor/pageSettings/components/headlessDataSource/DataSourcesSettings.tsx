import React, { useCallback, useMemo, useRef } from "react";
import { css } from "emotion";
import { set } from "dot-prop-immutable";
import cloneDeep from "lodash/cloneDeep";
import { useI18N } from "@webiny/app-i18n/hooks/useI18N";
import { Accordion, AccordionItem } from "@webiny/ui/Accordion";
import { BindComponent } from "@webiny/form";
import { GetEntriesDataSource } from "./GetEntriesDataSource";
import { GetEntryDataSource } from "./GetEntryDataSource";
import { Switch } from "@webiny/ui/Switch";
import { Cell, Grid } from "@webiny/ui/Grid";

const getEntryQuery = `# EXAMPLE QUERY
# Toggle comments: Ctrl + /
#
# query GetEntry($slug: String!) {
#   getArticle(where: { slug: $slug }) {
#     data {
#       id
#       title
#       content
#     }
#   }
# }
`;

const getEntriesQuery = `# EXAMPLE QUERY
# Toggle comments: Ctrl + /
#
# query GetEntries($limit: Int, $after: String) {
#   listArticles(limit: $limit, after: $after) {
#     data {
#       slug @pbMapToPath(name: "slug")
#     }
#   }
# }
`;

const noPadding = css({
    ">.webiny-ui-accordion-item__content": {
        padding: "0 !important"
    }
});

interface DataSourceProps {
    value: Record<string, any>;
    onChange: (value: Record<string, any>) => void;
    Bind: BindComponent;
}

const DataSourcesAccordion = ({ Bind, getBind, bind }) => {
    const getEntry = bind.value.find(ds => ds.type === "cms-get-entry");
    const getEntries = bind.value.find(ds => ds.type === "cms-get-entries");

    return (
        <Cell span={12}>
            <Accordion elevation={0}>
                <AccordionItem
                    key={getEntry.id}
                    title={getEntry.name}
                    icon={null}
                    className={noPadding}
                >
                    <GetEntryDataSource {...getBind(Bind, bind, 0)} />
                </AccordionItem>
                <AccordionItem
                    key={getEntries.id}
                    title={getEntries.name}
                    icon={null}
                    className={noPadding}
                >
                    <GetEntriesDataSource {...getBind(Bind, bind, 1)} />
                </AccordionItem>
            </Accordion>
        </Cell>
    );
};

const DataSourcesSettings = props => {
    const { Bind, data } = props;
    const { getCurrentLocale } = useI18N();
    const locale = getCurrentLocale("content");
    const enabled = (data.settings.dataSources || []).some(ds => ds.type === "cms-get-entry");

    const defaultDataSources = useMemo(() => {
        const READ_API_URL = process.env.REACT_APP_API_URL + `/cms/read/${locale}`;

        return [
            {
                type: "cms-get-entry",
                id: "get-entry",
                name: "Get a single entry",
                config: {
                    url: READ_API_URL,
                    query: getEntryQuery,
                    variables: []
                }
            },
            {
                type: "cms-get-entries",
                id: "get-entries",
                name: "Get all entries",
                config: {
                    url: READ_API_URL,
                    query: getEntriesQuery,
                    variables: []
                }
            }
        ];
    }, [locale]);
    const prefix = "settings.dataSources";

    const getBind = (Bind, bind, index): DataSourceProps => {
        const memoizedBinds = useRef([]);

        if (!memoizedBinds.current[index]) {
            // eslint-disable-next-line react/display-name
            memoizedBinds.current[index] = ({ children, name, ...props }) => {
                return (
                    <Bind name={`${prefix}.${index}.${name}`} {...props}>
                        {children}
                    </Bind>
                );
            };
        }

        return {
            value: bind.value[index],
            onChange: newValue => {
                bind.onChange(set(bind.value, index, newValue));
            },

            Bind: memoizedBinds.current[index]
        };
    };

    const toggleDataSources = useCallback((value, bind) => {
        bind.onChange(value ? defaultDataSources : []);
    }, []);

    return (
        <Bind name={prefix} defaultValue={cloneDeep(defaultDataSources)}>
            {bind => (
                <Grid>
                    <Cell span={12}>
                        <Switch
                            value={enabled}
                            label={"Enabled"}
                            description={`Enable Headless CMS data sources.`}
                            onChange={value => toggleDataSources(value, bind)}
                        />
                    </Cell>
                    {enabled && <DataSourcesAccordion bind={bind} getBind={getBind} Bind={Bind} />}
                </Grid>
            )}
        </Bind>
    );
};

export default DataSourcesSettings;
