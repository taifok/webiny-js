import React from "react";
import { css } from "emotion";
import classNames from "classnames";
import { Tooltip } from "@webiny/ui/Tooltip";
import { IconButton } from "@webiny/ui/Button";
import { PbEditorElement } from "@webiny/app-page-builder/types";
import { useActiveElement } from "@webiny/app-page-builder/editor/hooks/useActiveElement";
import { ContentWrapper } from "@webiny/app-page-builder/editor/plugins/elementSettings/components/StyledComponents";
import Accordion from "@webiny/app-page-builder/editor/plugins/elementSettings/components/Accordion";

const classes = {
    activeIcon: css({
        "&.mdc-icon-button": {
            color: "var(--mdc-theme-primary)"
        }
    }),
    icon: css({
        "&.mdc-icon-button": {
            color: "var(--mdc-theme-text-primary-on-background)"
        }
    })
};

type IconsType = {
    [key: string]: React.ReactElement;
};
// Icons map for dynamic render
const icons: IconsType = {
    left: <span>L</span>,
    center: <span>C</span>,
    right: <span>R</span>,
    justify: <span>J</span>
};

const iconDescriptions = {
    left: "Align left",
    center: "Align center",
    right: "Align right",
    justify: "Align justify"
};

const defaultAlignValue = "left";
const DEFAULT_ALIGNMENTS = Object.keys(icons);

const getAlignValue = (element: PbEditorElement, defaultAlign: string): string => {
    return element.data.settings?.horizontalAlign || defaultAlign;
};

type AlignTypesType = "left" | "center" | "right" | "justify";

type HorizontalAlignActionPropsType = {
    options: {
        alignments: string[];
    };
    defaultAccordionValue?: any;
};
const HorizontalAlignSettings = ({
    options: { alignments = DEFAULT_ALIGNMENTS },
    defaultAccordionValue
}: HorizontalAlignActionPropsType) => {
    const [element, updateElement] = useActiveElement();
    const align = getAlignValue(element, defaultAlignValue);

    const onClick = (type: AlignTypesType = defaultAlignValue) => {
        updateElement({
            ...element,
            data: {
                ...element.data,
                settings: {
                    ...element.data.settings,
                    horizontalAlign: type
                }
            }
        });
    };

    return (
        <Accordion title={"Text align"} defaultValue={defaultAccordionValue}>
            <ContentWrapper>
                {alignments.map(type => (
                    <Tooltip key={type} content={iconDescriptions[type]} placement={"top"}>
                        <IconButton
                            className={classNames({
                                [classes.activeIcon]: align === type,
                                [classes.icon]: align !== type
                            })}
                            icon={icons[type]}
                            onClick={() => onClick(type as AlignTypesType)}
                        />
                    </Tooltip>
                ))}
            </ContentWrapper>
        </Accordion>
    );
};

export default React.memo(HorizontalAlignSettings);
