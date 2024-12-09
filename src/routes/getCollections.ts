import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"

import Response from "../response/response"

type Collection = {
    id?: number,
    name?: string,
    imageURL?: string,
    resourceURL?: string
}

const getCollections: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get("/getCollections", async (request: FastifyRequest, reply: FastifyReply): Promise<Response> => {
        let response = new Response()

        const collections: Collection[] = await fastify.read<Collection>({
            tableName: "collections", 
            errors: response.errors
        })
        
        response.payload = collections

        return response
    })
}

export default getCollections