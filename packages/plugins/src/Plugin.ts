import uniqid from "uniqid";

export abstract class Plugin {
    public static type: string;
    public name: string;

    constructor() {
        if (!this.type) {
            throw Error(`Missing "type" definition in "${this.constructor.name}"!`);
        }
        
        if (!this.name) {
            this.name = uniqid(this.type + "-");
        }
    }

    get type() {
        return (this.constructor as typeof Plugin).type;
    }

    /**
     * We often need to reference a plugin by it's unique identifier. Until now, we used the `name` property,
     * but it makes more sense to call it what it is, thus the `id` property. Example:
     * { group: BasicElementGroupPlugin.id }
     */
    get id() {
        return this.name;
    }
}
