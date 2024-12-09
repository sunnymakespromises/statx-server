import fp from "fastify-plugin"
import fastifyPostgres from "@fastify/postgres"
import { PoolClient } from "pg"

import { SupportPluginOptions } from "./support"

export default fp<SupportPluginOptions>(async (fastify, opts) => {
    fastify.decorate("db", {
        async getter(): Promise<PoolClient> {
            return await fastify.pg.connect()
        }
    })
})

declare module "fastify" {
    export interface FastifyInstance {
        db: Promise<PoolClient>
    }
}