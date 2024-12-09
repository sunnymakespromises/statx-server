import fastifyPostgres from "@fastify/postgres"
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"
import { PoolClient, QueryResult } from "pg"

const test: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
        const client: PoolClient = await fastify.pg.connect()

        const result: QueryResult = await client.query('SELECT * FROM test');

        client.release()

        const response = {
            result: result
        }

        return response
    })
}

export default test