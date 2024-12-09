import fp from "fastify-plugin"
import { QueryResult, QueryResultRow } from "pg"

import { SupportPluginOptions } from "./support"
import { ResponseError } from "../response/response"

type CreateOperationProps = {
    tableName: string,
    item: QueryResultRow,
    errors: ResponseError[]
}

export default fp<SupportPluginOptions>(async (fastify, opts) => {
    fastify.decorate("create", async <Type extends QueryResultRow>(props: CreateOperationProps): Promise<Type | undefined> => {
        let createOperationResult: Type | undefined = undefined

        try {
            await fastify.pg.transact(async client => {
                const itemKeys: string[] = Object.keys(props.item)
                const itemValues: any[] = Object.values(props.item)

                const queryValuePlaceholdersString: string = itemKeys.map((key, index) => "$" + (index + 1)).join(", ") // Creates the part of the insert query that says $1, $2, $3, etc. depending on the number of keys in the item.
                const queryColumnsString: string = itemKeys.join(", ")
                const queryString: string = "INSERT INTO " + props.tableName + " (" + queryColumnsString  + ") VALUES (" + queryValuePlaceholdersString + ")"
                const queryResult: QueryResult<Type> = await client.query(queryString, itemValues)

                if (queryResult && queryResult.rows && queryResult.rowCount && queryResult.rowCount >= 0) { // If there is at least one result of the query.
                    createOperationResult = queryResult.rows[0] // Sets the create operation result to the first item of the query result.
                }
            })
        }
        catch(e: unknown) {
            let error: Error = e as Error
            props.errors.push({
                code: "DB_CREATE_FAILURE",
                message: "Attempt to create item in table " + props.tableName + " failed with error message: " + error.message
            })
        }
        finally {
            return createOperationResult
        }
    })
})

declare module "fastify" {
    export interface FastifyInstance {
        create<Type extends QueryResultRow>(props: CreateOperationProps): Promise<Type | undefined>
    }
}