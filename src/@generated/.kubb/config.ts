import type { ClientConfig } from './core'
import { multipartFormData } from './mediaTypes/formData'
import { urlencoded } from './mediaTypes/urlencoded'
import { serializePath } from './serializers/path'
import { serializeQuery } from './serializers/query'

/**
 * The config `client.ts` starts with: what this spec needs from the runtime.
 */
export const defaultConfig: ClientConfig = { baseURL: "http://localhost:8000", mediaTypes: { 'application/x-www-form-urlencoded': urlencoded, 'multipart/form-data': multipartFormData }, serializer: { query: serializeQuery, path: serializePath } }
