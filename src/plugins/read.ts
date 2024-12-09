import fp from "fastify-plugin"
import { PoolClient, QueryResult, QueryResultRow } from "pg"

import { SupportPluginOptions } from "./support"
import { ResponseError } from "../response/response"

type ReadOperationProps = {
    tableName: string,
    query?: string,
    limit?: number,
    errors: ResponseError[]
}

export default fp<SupportPluginOptions>(async (fastify, opts) => {
    fastify.decorate("read", async <Type extends QueryResultRow>(props: ReadOperationProps): Promise<Type[]> => {
        let readOperationResult: Type[] = []
        const db: PoolClient = await fastify.db
        
        try {
            let queryString = "SELECT" + (props.query ? " * " : " ") + "FROM " + props.tableName + (props.query ? " WHERE " + props.query : "")
            
            const queryResult: QueryResult<Type> = await db.query<Type>(queryString)
            if (queryResult && queryResult.rows && queryResult.rowCount && queryResult.rowCount >= 0) { // If there is at least one result of the query.
                readOperationResult = queryResult.rows.slice(0, props.limit ? props.limit : queryResult.rowCount) // Sets the read operation result to the rows of the query result (taking into account the given limit, if any.)
            }
        }
        catch(e: unknown) {
            let error: Error = e as Error
            props.errors.push({
                code: "DB_READ_FAILURE",
                message: "Attempt to read from table " + props.tableName + " failed with error message: " + error.message
            })
        }
        finally {
            db.release()
        }

        return readOperationResult
    })
})

declare module "fastify" {
    export interface FastifyInstance {
        read<Type extends QueryResultRow>(props: ReadOperationProps): Promise<Type[]>
    }
}