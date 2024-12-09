import fp from "fastify-plugin"
import { PoolClient, QueryResult, QueryResultRow } from "pg"

import { SupportPluginOptions } from "./support"

type ReadOperationProps = {
    tableName: string,
    query?: string,
    limit?: number
}

export default fp<SupportPluginOptions>(async (fastify, opts) => {
    fastify.decorate("read", async <Type extends QueryResultRow>(props: ReadOperationProps): Promise<Type[]> => {
        const { tableName, query, limit } = props
        console.log(props)
        let readOperationResult: Type[] = []
        const db: PoolClient = await fastify.db
        
        try {
            // Gets the string to query the db on depending on if there is a query or not.
            let queryString = ""
            if (query) {
                queryString = "SELECT FROM " + tableName + " WHERE " + query
            }
            else {
                queryString = "SELECT * FROM " + tableName
            }
            console.log(queryString)
            const queryResult: QueryResult<Type> = await db.query<Type>(queryString)
            console.log(queryResult)
            // If there is at least one result of the query.
            if (queryResult && queryResult.rows && queryResult.rowCount && queryResult.rowCount >= 0) {
                // Sets the read operation result to the rows of the query result (taking into account the given limit, if any.)
                readOperationResult = queryResult.rows.slice(0, limit ? limit : queryResult.rowCount)
            }
        }
        finally {
            db.release()
        }

        console.log(readOperationResult)
        return readOperationResult
    })
})

declare module "fastify" {
    export interface FastifyInstance {
        read<Type extends QueryResultRow>(props: ReadOperationProps): Promise<Type[]>
    }
}