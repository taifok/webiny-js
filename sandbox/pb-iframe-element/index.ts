class ElementType {
    createElement() {
        return {
            id: "",
            type: this._type,
            data: {},
            elements: [],
            version: this._version
        };
    }
}

class BackgroundSettingsRenderer extends UIRenderer {
    render({ element }) {
        return <BackgroundSettingsUI />;
    }
}

class BackgroundSettings extends UIElement {
    constructor() {
        super();

        this.addRenderer(new BackgroundSettingsRenderer());
    }
}

// Editor element type
class IframeElementType extends ElementType {
    private _version = "1.0.0";

    constructor(type: string) {
        super(type);

        this.setTitle("IFrame");
        this.setOnCreate(({ editor }) => {
            editor.openElementSettings();
        });

        this.addRenderer(new IframeElementEditorRenderer());
        this.addSettings(new MarginPaddingSettings())

    }
}

// Preview element type
class IframeElementRenderType extends ElementRenderType {
    constructor(type: string) {
        super(type);

        this.addRenderer(new IframeElementRenderer());
    }
}

// Page Builder App
new PageBuilderPlugin(app => {
    app.addElementRenderType(new IframeElementRenderType());
});

// Editor App
new PageBuilderEditorPlugin(app => {
    // Create element group
    const basicGroup = new ElementGroup("basic");
    basicGroup.setLabel("Basic");
    basicGroup.setIcon(<BasicIcon />);
    app.addElementGroup(basicGroup);

    // Element types can be instantiated with different IDs and options.
    // This allows us to create different variations of element types using the same class.
    const iframeElementType = new IframeElementType("iframe");

    // To be visible in the element toolbar, we need to assign a group to the element
    basicGroup.addElement(iframeElementType);

    // Finally, add element type instance to the Page Builder app.
    app.addElementType(iframeElementType);
    
    //

    app.addEventHandler(UpdateRevision, event => {
        const state = app.getPageState();
    })
});
