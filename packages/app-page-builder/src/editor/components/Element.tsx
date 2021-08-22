import React, { useCallback } from "react";
import { Transition } from "react-transition-group";
import Draggable from "./Draggable";
import tryRenderingPlugin from "../../utils/tryRenderingPlugin";

import {
    defaultStyle,
    ElementContainer,
    transitionStyles,
    typeStyle
} from "./Element/ElementStyled";
import { usePageEditor } from "~/editor/hooks/usePageEditor";
import { useElementById } from "~/editor/hooks/useElementById";
import { useActiveElementId } from "~/editor/hooks/useActiveElementId";

export type ElementPropsType = {
    id: string;
    className?: string;
    isHighlighted: boolean;
    isActive: boolean;
};

const ElementComponent: React.FunctionComponent<ElementPropsType> = ({
    id: elementId,
    className = "",
    isActive
}) => {
    const { app } = usePageEditor();
    const [element, updateElement] = useElementById(elementId);
    const { isHighlighted } = element;

    const elementType = app.getElementType(element.type);

    const beginDrag = useCallback(() => {
        const data = { id: element.id, type: element.type };
        setTimeout(() => {
            app.setIsDragging(true);
        });
        return { ...data, target: elementType.getTarget() };
    }, [elementId]);

    const endDrag = useCallback(() => {
        app.setIsDragging(false);
    }, [elementId]);

    const onClick = useCallback((): void => {
        if (!element || element.type === "document" || isActive) {
            return;
        }
        app.activateElement(elementId);
    }, [elementId, isActive]);

    const onMouseOver = useCallback(
        (ev): void => {
            if (!element || element.type === "document") {
                return;
            }
            ev.stopPropagation();
            if (isHighlighted) {
                return;
            }
            updateElement({ isHighlighted: true } as any);
        },
        [elementId]
    );
    const onMouseOut = useCallback(() => {
        if (!element || element.type === "document") {
            return;
        }
        updateElement({ isHighlighted: false } as any);
    }, [elementId]);

    const renderDraggable = ({ drag }): JSX.Element => {
        return (
            <div ref={drag} className={"type " + typeStyle}>
                <div className="background" onClick={onClick} />
                <div className={"element-holder"} onClick={onClick}>
                    {/* TODO: {renderPlugins("pb-editor-page-element-action", { element, plugin })}*/}
                    <span>{elementType.getId()}</span>
                </div>
            </div>
        );
    };

    if (!elementType) {
        return null;
    }

    const renderedPlugin = tryRenderingPlugin(() =>
        elementType.render({
            element,
            isActive
        })
    );

    const isDraggable = elementType.getTarget().length > 0;

    return (
        <Transition in={true} timeout={250} appear={true}>
            {state => (
                <ElementContainer
                    id={element.id}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    highlight={isActive ? true : isHighlighted}
                    active={isActive}
                    style={{ ...defaultStyle, ...transitionStyles[state] }}
                    className={"webiny-pb-page-element-container"}
                >
                    <div className={["innerWrapper", className].filter(c => c).join(" ")}>
                        <Draggable
                            enabled={isDraggable}
                            target={elementType.getTarget()}
                            beginDrag={beginDrag}
                            endDrag={endDrag}
                        >
                            {renderDraggable}
                        </Draggable>

                        {renderedPlugin}
                    </div>
                </ElementContainer>
            )}
        </Transition>
    );
};

const withHighlightElement = (Component: React.FunctionComponent) => {
    return function withHighlightElementComponent(props) {
        const [activeElementId] = useActiveElementId();

        return <Component {...props} isActive={activeElementId === props.id} />;
    };
};

export default withHighlightElement(React.memo<any>(ElementComponent));
