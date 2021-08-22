import React, { useEffect, useRef, useMemo, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "emotion";
import kebabCase from "lodash/kebabCase";
import { plugins } from "@webiny/plugins";
import { Elevation } from "@webiny/ui/Elevation";
import { PbEditorContentPlugin } from "~/types";
import { usePageBuilder } from "~/hooks/usePageBuilder";
import Element from "../Element";
import { usePageEditor } from "~/editor/hooks/usePageEditor";
import { useUI } from "~/editor/hooks/useUI";

const BREADCRUMB_HEIGHT = 33;

const ContentContainer = styled("div")(({ theme }) => ({
    backgroundColor: (theme as any)?.colors?.background,
    position: "relative",
    margin: "0 auto",
    ".webiny-pb-page-document": {
        overflowY: "visible", // cuts off the block selector tooltip
        overflowX: "visible",
        // We need this extra spacing so that editor content won't get cutoff
        paddingBottom: BREADCRUMB_HEIGHT
    }
}));

const contentContainerWrapper = css({
    margin: "95px 65px 50px 85px",
    padding: 0,
    position: "absolute",
    width: "calc(100vw - 115px - 300px)",
    //overflow: "hidden", // cuts off the block selector tooltip
    top: 0,
    boxSizing: "border-box",
    zIndex: 1
});

const BaseContainer = styled("div")({
    width: "100%",
    left: 52,
    margin: "0 auto"
});

const Content = () => {
    const { app } = usePageEditor();
    const rootElement = app.getRootElement();
    const [{ displayMode }, updateUI] = useUI();
    const pagePreviewRef = useRef();

    const setPagePreviewDimension = useCallback(
        pagePreviewDimension => {
            updateUI(state => ({ ...state, pagePreviewDimension }));
        },
        [displayMode]
    );

    const resizeObserver = useMemo(() => {
        return new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setPagePreviewDimension({ width, height });
            }
        });
    }, []);

    // Set resize observer
    useEffect(() => {
        if (pagePreviewRef.current) {
            // Add resize observer
            resizeObserver.observe(pagePreviewRef.current);
        }

        // Cleanup
        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const { theme } = usePageBuilder();
    const pluginsByType = plugins.byType<PbEditorContentPlugin>("pb-editor-content");

    return (
        <Elevation className={contentContainerWrapper} z={0}>
            <ContentContainer
                theme={theme}
                className={`mdc-elevation--z1 webiny-pb-editor-device--${kebabCase(
                    displayMode
                )} webiny-pb-media-query--${kebabCase(displayMode)}`}
            >
                {pluginsByType.map(plugin =>
                    React.cloneElement(plugin.render(), { key: plugin.name })
                )}
                <BaseContainer ref={pagePreviewRef} className={"webiny-pb-editor-content-preview"}>
                    <Element id={rootElement.id} />
                </BaseContainer>
            </ContentContainer>
        </Elevation>
    );
};

export default Content;
