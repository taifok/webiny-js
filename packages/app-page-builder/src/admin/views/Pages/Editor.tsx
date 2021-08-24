import React, { useCallback, useRef, useState, useEffect } from "react";
import editorMock from "../../assets/editor-mock.png";
import { useRouter } from "@webiny/react-router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Editor as PbEditor } from "../../../editor";
import { useSavedElements } from "../../hooks/useSavedElements";
import Snackbar from "@webiny/app-admin/ui/views/AdminView/components/Snackbar";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { DialogContainer } from "@webiny/app-admin/ui/views/AdminView/components/Dialog";
import { Typography } from "@webiny/ui/Typography";
import { LoadingEditor, LoadingTitle } from "./EditorStyled.js";
import { GET_PAGE, CREATE_PAGE_FROM } from "./graphql";
import { PbEditorApp } from "~/editor/app/PbEditorApp";
import { EditorAppProvider } from "~/editor/contexts/EditorAppProvider";

const extractPageGetPage = (data: any): any => {
    return data.pageBuilder?.getPage || {};
};

const extractPageData = (data: any): any => {
    const getPageData = extractPageGetPage(data);
    return getPageData.data;
};

const extractPageErrorData = (data: any): any => {
    const getPageData = extractPageGetPage(data);
    return getPageData.error || {};
};

const Editor: React.FunctionComponent = () => {
    const { match, history } = useRouter();
    const { showSnackbar } = useSnackbar();
    const ready = useSavedElements();
    const appRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        appRef.current = new PbEditorApp();
    }, []);

    const params: { id: string } = match.params as any;

    const renderEditor = useCallback(
        ({ data, loading }) => {
            if (loading || !ready) {
                return (
                    <LoadingEditor>
                        <img src={editorMock} alt={"page builder editor mock"} />
                        <LoadingTitle>
                            <Typography tag={"div"} use={"headline6"}>
                                Loading Editor<span>.</span>
                                <span>.</span>
                                <span>.</span>
                            </Typography>
                        </LoadingTitle>
                    </LoadingEditor>
                );
            }

            if (!data) {
                return null;
            }

            const { revisions = [], content, ...restOfPageData } = data;
            const page = {
                ...restOfPageData,
                content: content || appRef.current.getElementType("document").createElement()
            };

            return (
                <EditorAppProvider app={appRef.current}>
                    <PbEditor page={page} revisions={revisions} />
                    <div style={{ zIndex: 30, position: "absolute" }}>
                        <Snackbar />
                    </div>
                    <div>
                        <DialogContainer />
                    </div>
                </EditorAppProvider>
            );
        },
        [ready]
    );

    const [createPageFrom] = useMutation(CREATE_PAGE_FROM);

    useQuery(GET_PAGE, {
        variables: { id: decodeURIComponent(params.id) },
        fetchPolicy: "network-only",
        onCompleted: async data => {
            const errorData = extractPageErrorData(data);
            const error = errorData.message;
            if (error) {
                setLoading(false);
                history.push(`/page-builder/pages`);
                showSnackbar(error);
                return;
            }

            const page = extractPageData(data);
            if (page.status === "draft") {
                setData(page);
            } else {
                const response = await createPageFrom({
                    variables: { from: page.id }
                });

                history.push(
                    `/page-builder/editor/${encodeURIComponent(
                        response.data.pageBuilder.createPage.data.id
                    )}`
                );
                setTimeout(() => showSnackbar("New revision created."), 1500);
            }
            setLoading(false);
        }
    });

    return renderEditor({ loading, data });
};

export default Editor;
