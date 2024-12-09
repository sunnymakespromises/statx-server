import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"

import Response from "../response/response"

const root: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get("/", async (request: FastifyRequest, reply: FastifyReply): Promise<Response> => {
        return new Response({
            payload: "ping!"
        })
    })
}

export default root