import React, { useEffect, useState } from "react";
import { PbEditorElement } from "~/types";
import { breadcrumbs } from "./styles";
import { useActiveElement } from "~/editor/hooks/useActiveElement";
import { usePageEditor } from "~/editor/hooks/usePageEditor";

const Breadcrumbs: React.FunctionComponent = () => {
    const { app } = usePageEditor();
    const [activeElement, setActiveElement] = useActiveElement();
    const [items, setItems] = useState([]);

    const createBreadCrumbs = (activeElement: PbEditorElement) => {
        const list = [];
        let element = activeElement;
        while (element.parent) {
            list.push({
                id: element.id,
                type: element.type
            });

            if (!element.parent) {
                break;
            }

            element = app.getElementById(element.parent);
        }
        setItems(list.reverse());
    };

    useEffect(() => {
        if (activeElement) {
            createBreadCrumbs(activeElement);
        }
    }, [activeElement]);

    if (!activeElement) {
        return null;
    }

    return (
        <ul className={breadcrumbs}>
            {items.map(({ id, type }, index) => (
                <li
                    key={id}
                    onMouseOver={() => app.highlightElement(id)}
                    onClick={() => setActiveElement(id)}
                >
                    <span
                        className={"element"}
                        style={{ "--element-count": index } as React.CSSProperties}
                    >
                        {type}
                    </span>
                </li>
            ))}
        </ul>
    );
};
export default React.memo(Breadcrumbs);
