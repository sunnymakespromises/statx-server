import fp from "fastify-plugin"
import { QueryResult, QueryResultRow } from "pg"

import { SupportPluginOptions } from "./support"

type CreateOperationProps = {
    tableName: string,
    item: QueryResultRow
}

export default fp<SupportPluginOptions>(async (fastify, opts) => {
    fastify.decorate("create", async <Type extends QueryResultRow>(props: CreateOperationProps): Promise<Type> => {
        const { tableName, item } = props
        console.log(props)

        const transactResult = await fastify.pg.transact(async client => {
            const itemKeys: string[] = Object.keys(item)
            console.log(itemKeys)
            const itemValues: any[] = Object.values(item)
            console.log(itemValues)
            // Creates the part of the query that says $1, $2, $3, depending on the number of keys in the item.
            const queryValuePlaceholders: string = itemKeys.map((key, index) => "$" + (index + 1)).join(", ")
            console.log(queryValuePlaceholders)
            const result: QueryResult<Type> = await client.query(
                "INSERT INTO " + tableName + " (" + itemKeys.join(", ")  + ") VALUES (" + queryValuePlaceholders + ")",
                [itemValues]
            )
            console.log(result)
            return result.rows[0]
        })

        console.log(transactResult)
        return transactResult
    })
})

declare module "fastify" {
    export interface FastifyInstance {
        create<Type extends QueryResultRow>(props: CreateOperationProps): Promise<Type>
    }
}