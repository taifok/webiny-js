import React, { useCallback, useRef } from "react";
import { useRecoilState } from "recoil";
import useDeepCompareEffect from "use-deep-compare-effect";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { pageAtom } from "@webiny/app-page-builder/editor/recoil/modules/page";
import { SnackbarAction } from "@webiny/ui/Snackbar";
import { DynamicPageAtom } from "~/types";
import { DataSourceLoader } from "../plugins/DataSourcePlugin";

interface RegisterLoader {
    (type: string, loader: (dataSource: any) => Promise<any>): void;
}

const LoadDataSources = () => {
    const loaders = useRef(new Map<string, any>());
    const { showSnackbar } = useSnackbar();
    const [pageAtomValue, setPageAtomValue] = useRecoilState<DynamicPageAtom>(pageAtom);
    let { dataSources } = pageAtomValue.settings;

    if (!dataSources) {
        dataSources = [];
    }

    const loadDataSources = useCallback(async (dataSources = []) => {
        const loadedData = [];

        for (const dsConfig of dataSources) {
            const { id, type, name } = dsConfig;
            try {
                const loader = loaders.current.get(type);

                if (!loader) {
                    continue;
                }

                const data = await loader(dsConfig);

                loadedData.push({ id, type, data });
            } catch (e) {
                showSnackbar(
                    <span>
                        <strong>Failed to load datasource &quot;{name}&quot;</strong>
                        <br />
                        {e.message}
                    </span>,
                    {
                        timeout: 60000,
                        dismissesOnAction: true,
                        action: <SnackbarAction label={"OK"} />
                    }
                );
            }
        }

        setPageAtomValue(page => ({
            ...page,
            dataSources: loadedData
        }));
    }, []);

    const registerLoader = useCallback<RegisterLoader>((type, loader) => {
        loaders.current.set(type, loader);
        return () => {
            loaders.current.delete(type);
        };
    }, []);

    useDeepCompareEffect(() => {
        loadDataSources(dataSources);
    }, [dataSources]);

    return <DataSourceLoader onLoad={registerLoader} />;
};

export default LoadDataSources;
