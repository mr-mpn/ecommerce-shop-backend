import middy from '@middy/core';
import { HealthResponse } from '../../types/healthTypes';
import { createSuccessResponse } from '../../middleware/response';
import { APIGatewayProxyEvent , Context } from 'aws-lambda';


export const getHealthHandler = middy()
    .handler(async (event: APIGatewayProxyEvent, context: Context) => {
        console.log(`
            API = /health
            `)
        const response: HealthResponse = {
            message: 'Hello World! API is healthy and running.',
            timestamp: new Date().toISOString()
            };
        return createSuccessResponse(response);
    })