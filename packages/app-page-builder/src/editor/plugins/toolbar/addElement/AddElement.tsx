import React, { useCallback, useEffect, useState } from "react";
import * as Styled from "./StyledComponents";
import {
    DeactivatePluginActionEvent,
    DragEndActionEvent,
    DragStartActionEvent,
    DropElementActionDataType,
    DropElementActionEvent
} from "../../../actions";
import Draggable from "../../../components/Draggable";
import { css } from "emotion";
import { List, ListItem, ListItemMeta } from "@webiny/ui/List";
import { Icon } from "@webiny/ui/Icon";
import { Typography } from "@webiny/ui/Typography";
import { ButtonFloating } from "@webiny/ui/Button";
import { ReactComponent as AddIcon } from "../../../assets/icons/add.svg";
import { useKeyHandler } from "../../../hooks/useKeyHandler";
import { usePageEditor } from "~/editor/hooks/usePageEditor";
import { PbElementType } from "~/editor/contexts/app/PbElementType";

const ADD_ELEMENT = "pb-editor-toolbar-add-element";

// @ts-ignore
const categoriesList = css({
    backgroundColor: "var(--mdc-theme-surface)",
    boxShadow: "inset 1px 0px 5px 0px var(--mdc-theme-background)",
    borderTop: "1px solid var(--mdc-theme-background)",
    ".mdc-list-item": {
        width: 150,
        fontWeight: "600 !important",
        borderBottom: "1px solid var(--mdc-theme-background)",
        "&.active": {
            backgroundColor: "var(--mdc-theme-background)",
            color: "var(--mdc-theme-primary)",
            ".mdc-list-item__meta": {
                color: "var(--mdc-theme-primary)"
            }
        }
    }
});

const AddElement: React.FunctionComponent = () => {
    const { app } = usePageEditor();
    const plugin = app.getActivePluginByName(ADD_ELEMENT);
    const { params } = plugin || {};
    const { removeKeyHandler, addKeyHandler } = useKeyHandler();

    const dragStart = useCallback(() => {
        app.dispatchEvent(new DragStartActionEvent());
    }, []);
    const dragEnd = useCallback(() => {
        app.dispatchEvent(new DragEndActionEvent());
    }, []);
    const deactivatePlugin = useCallback(() => {
        app.dispatchEvent(
            new DeactivatePluginActionEvent({
                name: ADD_ELEMENT
            })
        );
    }, []);
    const dropElement = useCallback((data: DropElementActionDataType) => {
        console.log("dropElement in AddElement component", data);
        app.dispatchEvent(new DropElementActionEvent(data));
    }, []);

    const [group, setGroup] = useState<string>(app.getElementGroups()[0].getId());

    // TODO: refresh on element title for elemenets that can be renamed.
    // This should probably be done via an event.
    const refresh = useCallback(() => {
        setGroup(group);
    }, []);

    const enableDragOverlay = useCallback(() => {
        const el = document.querySelector(".pb-editor");
        if (!el) {
            return;
        }
        el.classList.add("pb-editor-dragging");
    }, []);

    const disableDragOverlay = useCallback(() => {
        const el = document.querySelector(".pb-editor");
        if (!el) {
            return;
        }
        el.classList.remove("pb-editor-dragging");
    }, []);

    const renderDraggable = useCallback((element, elementType: PbElementType) => {
        const id = elementType.getId();
        return (
            <Draggable
                enabled={true}
                key={id}
                target={elementType.getTarget()}
                beginDrag={props => {
                    dragStart();
                    setTimeout(deactivatePlugin, 20);
                    return { type: id, target: props.target };
                }}
                endDrag={() => {
                    dragEnd();
                }}
            >
                {({ drag }) => (
                    <div ref={drag}>{renderOverlay(element, null, "Drag to Add", elementType)}</div>
                )}
            </Draggable>
        );
    }, []);

    const renderOverlay = useCallback(
        (element, onClick = null, label, elementType: PbElementType) => {
            return (
                <Styled.ElementPreview key={elementType.getId()}>
                    <Styled.Overlay>
                        <Styled.Backdrop className={"backdrop"} />
                        <Styled.AddBlock className={"add-block"}>
                            <ButtonFloating
                                data-testid={`pb-editor-add-element-button-${elementType.getId()}`}
                                onClick={onClick}
                                label={label}
                                icon={<AddIcon />}
                                onMouseDown={enableDragOverlay}
                                onMouseUp={disableDragOverlay}
                            />
                        </Styled.AddBlock>
                    </Styled.Overlay>
                    {element}
                </Styled.ElementPreview>
            );
        },
        [enableDragOverlay, disableDragOverlay]
    );

    const renderClickable = useCallback(
        (element, plugin) => {
            const item = renderOverlay(
                element,
                () => {
                    dropElement({
                        source: { type: plugin.elementType } as any,
                        target: { ...params }
                    });
                    deactivatePlugin();
                },
                "Click to Add",
                plugin
            );

            return React.cloneElement(item, { key: plugin.name });
        },
        [params, deactivatePlugin, dropElement, renderOverlay]
    );

    useEffect(() => {
        addKeyHandler("escape", e => {
            e.preventDefault();
            deactivatePlugin();
        });

        return () => removeKeyHandler("escape");
    });

    const groupElements = group ? app.getElementGroup(group).getElementTypes() : [];

    return (
        <Styled.Flex>
            <List className={categoriesList}>
                {app.getElementGroups().map(elementGroup => (
                    <ListItem
                        onClick={() => setGroup(elementGroup.getId())}
                        key={elementGroup.getId()}
                        className={elementGroup.getId() === group && "active"}
                    >
                        {elementGroup.getLabel()}

                        {elementGroup.getIcon() && (
                            <ListItemMeta>
                                <Icon icon={elementGroup.getIcon()} />
                            </ListItemMeta>
                        )}
                    </ListItem>
                ))}
            </List>
            <Styled.Elements>
                {groupElements.length
                    ? groupElements.map(elementType => {
                          return (params ? renderClickable : renderDraggable)(
                              <div data-role="draggable">
                                  <Styled.ElementBox>
                                      <Styled.ElementTitle>
                                          <Typography use="overline">
                                              {elementType.getLabel()}
                                          </Typography>
                                          {/*{typeof plugin.toolbar.title === "function" ? (*/}
                                          {/*    plugin.toolbar.title({ refresh })*/}
                                          {/*) : (*/}
                                          {/*    <Typography use="overline">*/}
                                          {/*        {elementType.getLabel()}*/}
                                          {/*    </Typography>*/}
                                          {/*)}*/}
                                      </Styled.ElementTitle>
                                      <Styled.ElementPreviewCanvas>
                                          {elementType.getToolbarPreview()}
                                      </Styled.ElementPreviewCanvas>
                                  </Styled.ElementBox>
                              </div>,
                              elementType
                          );
                      })
                    : app.getElementGroup(group).getEmptyView()}
            </Styled.Elements>
        </Styled.Flex>
    );
};

export default React.memo(AddElement);
