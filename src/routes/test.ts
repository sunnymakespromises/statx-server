import fastifyPostgres from "@fastify/postgres"
import { UUID } from "crypto"
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"
import { PoolClient, QueryResult } from "pg"

type TestQueryResult = {
    id: UUID,
    message: string
}

type TestResponse = {
    results: TestQueryResult[]
}

const test: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
        const client: PoolClient = await fastify.pg.connect()

        const result: QueryResult = await client.query<TestQueryResult>('SELECT * FROM test');

        client.release()

        const response: TestResponse = {
            results: result.rows
        }

        return response
    })
}

export default test