import React, { useCallback } from "react";
import { useRecoilValue } from "recoil";
import styled from "@emotion/styled";
import SingleImageUpload from "@webiny/app-admin/components/SingleImageUpload";
import { PbEditorElement } from "~/types";
import { UpdateElementActionEvent } from "../../../actions";
import { uiAtom } from "../../../state";
import { usePageEditor } from "~/editor/hooks/usePageEditor";

const AlignImage = styled("div")((props: any) => ({
    img: {
        alignSelf: props.align
    }
}));

type ImageContainerType = {
    element: PbEditorElement;
};
const ImageContainer: React.FunctionComponent<ImageContainerType> = ({ element }) => {
    const { displayMode } = useRecoilValue(uiAtom);
    const { app } = usePageEditor();
    const {
        id,
        data: { image = {}, settings = {} }
    } = element || {};
    const { horizontalAlignFlex } = settings;
    // Use per-device style
    const align = horizontalAlignFlex[displayMode] || "center";

    const imgStyle = { width: null, height: null };
    if (image.width) {
        const { width } = image;
        imgStyle.width = width;
    }
    if (image.height) {
        const { height } = image;
        imgStyle.height = height;
    }

    const onChange = useCallback(
        async (data: { [key: string]: string }) => {
            app.dispatchEvent(
                new UpdateElementActionEvent({
                    element: {
                        ...element,
                        data: {
                            ...element.data,
                            image: {
                                ...(element.data.image || {}),
                                file: data
                            }
                        }
                    },
                    history: true
                })
            );
        },
        [id]
    );
    // required due to re-rendering when set content atom and still nothing in elements atom
    if (!element) {
        return null;
    }

    return (
        <AlignImage align={align}>
            <SingleImageUpload
                imagePreviewProps={{ style: imgStyle, srcSet: "auto" }}
                onChange={onChange}
                value={image.file}
            />
        </AlignImage>
    );
};

export default React.memo(ImageContainer);
