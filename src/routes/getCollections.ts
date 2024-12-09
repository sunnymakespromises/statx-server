import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"

import { randomUUID, UUID } from "crypto"

type Collection = {
    id?: UUID,
    name?: string,
    image?: string,
    url?: string
}

const getCollections: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get("/getCollections", async (request: FastifyRequest, reply: FastifyReply) => {
        const newCollection: Collection = await fastify.create<Collection>({
            tableName: "collections", 
            item: {
                id: randomUUID(),
                name: "hehe",
                image: "lol",
                url: ",o,"
            }
        })
        
        return "hiii"
    })
}

export default getCollections