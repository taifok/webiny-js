import React from "react";

export class PbElementSettings {
    private _id: string;

    constructor(id: string) {
        this._id = id;
    }
    
    getId() {
        return this._id;
    }
}
