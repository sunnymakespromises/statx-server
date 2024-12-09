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
        const collections: Collection[] = await fastify.read<Collection>({
            tableName: "collections"
        })

        const newCollection: Collection = await fastify.create<Collection>({
            tableName: "collections", 
            item: {
                id: randomUUID(),
                name: "hehe",
                image: "lol",
                url: ",o,"
            }
        })

        const collections2: Collection[] = await fastify.read<Collection>({
            tableName: "collections", 
            query: "name = 'hehe'"
        })

        const collections3: Collection[] = await fastify.read<Collection>({
            tableName: "collections", 
            query: "name = hehe"
        })

        return {
            collections: collections,
            newCollection: newCollection,
            collections2: collections2,
            collections3: collections3
        }
    })
}

export default getCollections