"use strict";

import * as error from "../server/error";
import { IAdoptionPet, AdoptPet } from "./schema";
const mongoose = require("mongoose");

export async function findAllForAdoption(): Promise<Array<IAdoptionPet>> {
  try {
    const result = await AdoptPet.find({
      enabled: true
    }).exec();
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function validateUpdate(body: IAdoptionPet): Promise<IAdoptionPet> {
  const result: error.ValidationErrorMessage = {
    messages: []
  };

  if (body.name && body.name.length > 256) {
    result.messages.push({ path: "name", message: "Hasta 256 caracteres solamente." });
  }

  if (body.description && body.description.length > 1024) {
    result.messages.push({ path: "description", message: "Hasta 1024 caracteres solamente." });
  }

  var isNumber = /^\d+\.\d+$/.test(body.phoneContact);
  if (isNumber) {
    result.messages.push({ path: "phoneContact", message: "No puede contener letras." });
  }

  if (result.messages.length > 0) {
    return Promise.reject(result);
  }

  return Promise.resolve(body);
}

export async function update(userId: string, body: IAdoptionPet): Promise<IAdoptionPet> {
  try {
    let current: IAdoptionPet;

    current = new AdoptPet();
    current.user = mongoose.Types.ObjectId.createFromHexString(userId);

    const validBody = await validateUpdate(body);
    if (validBody.name) {
      current.name = validBody.name;
    }
    if (validBody.description) {
      current.description = validBody.description;
    }

    if (validBody.foundPlace) {
      current.foundPlace = validBody.foundPlace;
    }

    current.foundDate = body.foundDate;

    if (validBody.phoneContact) {
      current.phoneContact = validBody.phoneContact;
    }

    console.log(current)

    await current.save();
    return Promise.resolve(current);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function remove(petId: string): Promise<void> {
  try {

    const pet = await AdoptPet.findOne({
      _id: petId,
      enabled: true
    }).exec();
    console.log(pet)
    if (!pet) {
      console.log("ERROR")
      throw error.ERROR_NOT_FOUND;
    }
    pet.enabled = false;
    await pet.save();
  } catch (err) {
    return Promise.reject(err);
  }
}
