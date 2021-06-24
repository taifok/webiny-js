import React, {Fragment, useCallback, useState } from "react";
import get from "lodash/get";
import styled from "@emotion/styled";
import { ViewPlugin } from "@webiny/app/plugins/ViewPlugin";
import { SelectDataSource } from "./SelectDataSource";

const ViewContainer = styled("div")({
    position: "relative"
});

const DynamicData = styled("span")({
    position: "absolute",
    right: 5,
    top: 5,
    zIndex: 10000,
    color: "var(--webiny-theme-color-primary)",
    cursor: "pointer"
});

const DisabledOverlay = styled("div")({
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    zIndex: 9000,
    backgroundColor: "var(--mdc-theme-background)",
    opacity: 0.7,
    pointerEvents: "none"
});

const BindDataSource = ({ children, Bind, data, setValue }) => {
    const snippet = get(data.settings, "overrides.general.snippet");
    const [showDialog, setShowDialog] = useState(false);

    const setBinding = useCallback(
        ({ dataSource, path }) => {
            setValue("settings.overrides.general.snippet", { dataSource, path });
            setShowDialog(false);
        },
        [snippet]
    );

    const cancelBinding = useCallback(() => {
        setValue("settings.overrides.general.snippet", undefined);
    }, [snippet]);

    let overlay = null;
    let action = (
        <a href={null} onClick={() => setShowDialog(true)}>
            Use data source
        </a>
    );

    if (snippet) {
        // Disable view
        overlay = <DisabledOverlay />;
        action = (
            <Fragment>
                <a href={null} onClick={cancelBinding}>
                    Use static data
                </a>
                <span>&nbsp;|&nbsp;</span>
                <a href={null} onClick={() => setShowDialog(true)}>
                    Edit data source
                </a>
            </Fragment>
        );
    }

    return (
        <ViewContainer>
            <DynamicData>
                {action}
                <Bind name={"settings.overrides.general.snippet"} />
            </DynamicData>
            {overlay}
            {children}
            <SelectDataSource
                open={showDialog}
                onSubmit={setBinding}
                onClose={() => setShowDialog(false)}
            />
        </ViewContainer>
    );
};

export default () => [
    new ViewPlugin({
        name: "pb.editor.settings.general.snippet",
        render({ children, ...rest }) {
            return <BindDataSource {...rest}>{children}</BindDataSource>;
        }
    })
];
