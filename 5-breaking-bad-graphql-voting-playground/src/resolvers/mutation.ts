import { IResolvers } from "graphql-tools";
import { getCharacter, getCharacters, asignVoteId, getVote } from "../lib/database-operations";
import { Datetime } from "../lib/datetime";
import { COLLECTIONS, CHANGE_VOTES } from "../config/constants";
async function response(status: boolean, message: string, db: any) {
    
    return {
        status,
        message,
        characters: await getCharacters(db)
    }
}
async function sendNotification(pubsub: any, db: any) {
    pubsub.publish(CHANGE_VOTES, { newVote: await getCharacters(db)})
}
const mutation: IResolvers = {
    Mutation: {
        async addVote(_: void, { character }, { pubsub, db}) {
            // Comprobar que el personaje existe
            const selectCharacter = await getCharacter(db, character);
            if (selectCharacter === null || selectCharacter === undefined) {
               return {
                   id: -1,
                   character: 'El voto NO se ha emitido. Personaje NO existe Prueba de nuevo por favor',
                   createdAt: new Date().toISOString()
               };
            }
            
            // Obtenemos el id del voto y creamos el objeto del voto
            const vote = {
                id: await asignVoteId(db),
                character,
                createdAt: new Datetime().getCurrentDateTime()
            };
            // Añadimos el voto
            return await db.collection(COLLECTIONS.VOTES).insertOne(vote).then(
                async() => {
                    sendNotification(pubsub, db);
                    return vote
                }
            ).catch(
                async() => {
                    return response(false, 'El voto NO se ha emitido. Prueba de nuevo por favor', db);
                }
            );    
        },
    }
}

export default mutation;