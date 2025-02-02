import React, { ReactElement } from "react";
import styled from "@emotion/styled";
import { Typography } from "@webiny/ui/Typography";
import { ReactComponent as TouchIcon } from "../assets/icons/touch_app.svg";

const EmptyViewWrapper = styled("div")({
    width: "100%",
    height: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    "& .media": {
        "& svg": {
            width: 75,
            height: 75,
            fill: "var(--mdc-theme-text-icon-on-background)"
        },
        marginBottom: 30
    },
    "& .title__container": {
        maxWidth: 276,
        textAlign: "center",
        marginBottom: 24,
        "& .title": {
            color: "var(--mdc-theme-text-secondary-on-background)"
        }
    },
    "& .action__container": {
        "& .mdc-button": {
            padding: "0px 16px",
            backgroundColor: "var(--mdc-theme-surface)"
        }
    }
});
export interface EmptyViewProps {
    icon?: ReactElement;
    title: string;
    action: ReactElement | null;
}
const EmptyView: React.FC<EmptyViewProps> = ({ icon = <TouchIcon />, title, action }) => {
    return (
        <EmptyViewWrapper>
            <div className={"media"}>{icon}</div>
            <div className="title__container">
                <Typography use={"subtitle1"} className={"title"}>
                    {title}
                </Typography>
            </div>
            <div className="action__container">{action}</div>
        </EmptyViewWrapper>
    );
};

export default EmptyView;
