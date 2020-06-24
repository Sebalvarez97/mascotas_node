"use strict";

import * as mongoose from "mongoose";

export interface IAdoptionPet extends mongoose.Document {
    name: string;
    foundDate: string;
    description: string;
    phoneContact: string;
    foundPlace: string;
    user: mongoose.Schema.Types.ObjectId;
    updated: Number;
    created: Number;
    enabled: Boolean;
}

/**
 * Esquema de Mascotas Perdidas
 */
export let AdoptPetSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
        trim: true,
        required: "Nombre es requerido"
    },
    foundDate: {
        type: String,
        default: "",
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    phoneContact: {
        type: String,
        default: "",
        trim: true
    },
    foundPlace: {
        type: String,
        default: "",
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: "Usuario es requerido"
    },
    updated: {
        type: Date,
        default: Date.now()
    },
    created: {
        type: Date,
        default: Date.now()
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, { collection: "adoption_pets" });

/**
 * Antes de guardar
 */
AdoptPetSchema.pre("save", function (this: IAdoptionPet, next) {
    this.updated = Date.now();

    next();
});

export let AdoptPet = mongoose.model<IAdoptionPet>("AdoptPet", AdoptPetSchema);
