import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpRouterHandler from '@middy/http-router'
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpJsonBodyParser from "@middy/http-json-body-parser";

import { routes } from "./src/api/routes"


export const handler = middy()
    .use(httpEventNormalizer())
    .use(cors({
        origin: '*',
        headers: 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        credentials: false
    }))
    .handler(httpRouterHandler(routes))