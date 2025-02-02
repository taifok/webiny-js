import React from "react";
import { css } from "emotion";
import { renderPlugins } from "@webiny/app/plugins";
import { Typography } from "@webiny/ui/Typography";
import { Grid, Cell } from "@webiny/ui/Grid";
import { PbPageData } from "~/types";

const headerTitle = css({
    "&.mdc-layout-grid": {
        borderBottom: "1px solid var(--mdc-theme-on-background)",
        color: "var(--mdc-theme-text-primary-on-background)",
        background: "var(--mdc-theme-surface)",
        paddingTop: 10,
        paddingBottom: 9,
        ".mdc-layout-grid__inner": {
            alignItems: "center"
        }
    }
});

const pageTitle = css({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
});

const headerActions = css({
    justifyContent: "flex-end",
    marginRight: "-15px",
    display: "flex",
    alignItems: "center"
});

interface HeaderProps {
    page: PbPageData;
}
const Header: React.FC<HeaderProps> = props => {
    const { page } = props;
    return (
        <React.Fragment>
            <Grid className={headerTitle}>
                <Cell span={8} className={pageTitle}>
                    <Typography use="headline5">{page.title}</Typography>
                </Cell>
                <Cell span={4} className={headerActions}>
                    {renderPlugins("pb-page-details-header-left", props)}
                    {renderPlugins("pb-page-details-header-right", props)}
                </Cell>
            </Grid>
        </React.Fragment>
    );
};

export default Header;
