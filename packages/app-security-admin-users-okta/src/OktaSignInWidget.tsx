import React, { useEffect, useRef } from "react";
import { useOktaAuth } from "@okta/okta-react";
import OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import styled from "@emotion/styled";

interface OktaSignInWidgetProps {
    oktaSignIn: OktaSignIn;
}

export const Wrapper = styled("section")({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "100vh",
    marginTop: "-100px",
    color: "var(--mdc-theme-on-surface)",
    "#okta-sign-in": {
        marginTop: 0
    }
});

export const LoginContent = styled("div")({
    width: "100%",
    maxWidth: 500,
    margin: "0 auto 25px auto",
    ".mdc-elevation--z2": {
        borderRadius: 4,
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.15)"
    },
    a: {
        textDecoration: "none",
        color: "var(--mdc-theme-primary)",
        fontWeight: 600,
        "&:hover": {
            textDecoration: "underline"
        }
    }
});

const OktaSignInWidget = ({ oktaSignIn }: OktaSignInWidgetProps) => {
    const { oktaAuth } = useOktaAuth();
    const widgetRef = useRef();

    useEffect(() => {
        if (!widgetRef.current) {
            return;
        }

        oktaSignIn.renderEl(
            { el: widgetRef.current },
            res => {
                oktaAuth.handleLoginRedirect(res.tokens);
            },
            err => {
                throw err;
            }
        );

        return () => oktaSignIn.remove();
    }, [oktaAuth]);

    return (
        <Wrapper>
            <LoginContent ref={widgetRef} />
        </Wrapper>
    );
};
export default OktaSignInWidget;
