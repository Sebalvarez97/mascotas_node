"use strict";

import * as express from "express";
import * as error from "../server/error";
import { onlyLoggedIn } from "../token/passport";
import { ISessionRequest } from "../user/service";
import * as service from "./service";

/**
 * Modulo para reportar posibles adopciones de mascotas
 */
export function initModule(app: express.Express) {
    // Rutas de acceso a mascotas
    app
        .route("/v1/adoptpet")
        .get(onlyLoggedIn, findAll)
        .post(onlyLoggedIn, create);

    app
        .route("/v1/adoptpet/:id")
        .delete(onlyLoggedIn, removeById);
}

/**
 * @api {get} /v1/adoptpet Listar Mascotas
 * @apiName Mascotas en Adopción
 * @apiGroup Adopción
 *
 * @apiDescription Obtiene un listado de las mascotas en adopción registradas.
 *
 * @apiSuccessExample {json} Mascota
 *  [
 *    {
 *      "id": "Id de mascota"
 *      "name": "Nombre de la mascota",
 *      "description": "Descripción de la mascota",
 *      "foundDate": date (DD/MM/YYYY),
 *    }, ...
 *  ]
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */
async function findAll(req: ISessionRequest, res: express.Response) {
    const result = await service.findAllForAdoption();
    res.json(result.map(u => {
        return {
            id: u.id,
            name: u.name,
            foundDate: u.foundDate,
            description: u.description,
            phoneContact: u.phoneContact,
            foundPlace: u.foundPlace
        };
    }));
}

/**
 * @apiDefine IMascotaResponse
 *
 * @apiSuccessExample {json} Mascota
 *    {
 *      "id": "Id de mascota",
 *      "name": "Nombre de la mascota",
 *      "description": "Descripción de la mascota",
 *      "foundDate": date (DD/MM/YYYY),
 *    }
 */

/**
 * @api {post} /v1/adoptpet Registrar Mascota en Adopción
 * @apiName Registrar Mascota
 * @apiGroup Adopción
 *
 * @apiDescription Registrar Mascota en Adopción.
 *
 * @apiExample {json} Mascota
 *    {
 *      "id": "Id mascota"
 *    }
 *
 * @apiUse IMascotaResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function create(req: ISessionRequest, res: express.Response) {
    const result = await service.update(req.user.user_id, req.body);
    res.json({
        id: result.id
    });
}

/**
 * @api {delete} /v1/adoptpet/:id Eliminar Mascota en Adopción
 * @apiName Eliminar Mascota
 * @apiGroup Adopción
 *
 * @apiDescription Eliminar una mascota en Adopción.
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */
async function removeById(req: ISessionRequest, res: express.Response) {
    console.log(req)
    await service.remove(req.params.id);
    res.send();
}