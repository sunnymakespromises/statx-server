type ResponseErrorCode = 
    "DB_READ_FAILURE" | 
    "DB_CREATE_FAILURE" | 
    "DB_UPDATE_FAILURE" | 
    "DB_DELETE_FAILURE"

export type ResponseError = {
    code: ResponseErrorCode,
    message: string
}

export default class Response {
    timestamp: string
    payload: any
    errors: ResponseError[]

    constructor(payload: any = undefined, errors: ResponseError[] = []) {
        this.timestamp = new Date().toISOString()
        this.payload = payload
        this.errors = errors
    }
}