import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { createErrorResponse, createSuccessResponse } from '../../middleware/response';
import { APIGatewayProxyEvent } from 'aws-lambda';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config();

interface PostLoginAdminBody {
    username : string,
    password : string
}


export const postAuthenticateLoginAdmin = middy()
    .use(httpJsonBodyParser())
    .handler(async (event: APIGatewayProxyEvent) => {
        try {
            console.log('=== Starting admin authentication process ===')
            console.log('Raw event.body type:', typeof event.body)
            console.log('Raw event.body:', event.body)
            
            let body: PostLoginAdminBody;
            
            // Handle both parsed and unparsed body
            if (typeof event.body === 'string') {
                console.log('Body is string, parsing JSON manually...')
                try {
                    body = JSON.parse(event.body);
                } catch (parseError) {
                    console.error('Failed to parse JSON body:', parseError)
                    return createErrorResponse('Bad Request', 'Invalid JSON format', 400)
                }
            } else {
                console.log('Body is already parsed by middleware')
                body = event.body as unknown as PostLoginAdminBody;
            }
            
            console.log('Final parsed body:', { username: body?.username, password: body?.password ? '[REDACTED]' : 'undefined' })
            
            if (!body || typeof body !== 'object') {
                console.error('Invalid request body - not an object:', body)
                return createErrorResponse('Bad Request', 'Invalid JSON body', 400)
            }
            
            const { username, password } = body

            if (!username || !password) {
                console.error('Missing username or password in request body')
                return createErrorResponse('Bad Request', 'Username and password are required', 400)
            }

            console.log('Loading environment variables...')
            const ADMIN_USERNAME = process.env.ADMIN_USERNAME
            const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
            const JWT_SECRET = process.env.JWT_SECRET

            console.log('Environment check:', {
                hasAdminUsername: !!ADMIN_USERNAME,
                hasAdminPassword: !!ADMIN_PASSWORD,
                hasJwtSecret: !!JWT_SECRET
            })

            if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
                console.error('Missing admin credentials in environment variables')
                return createErrorResponse('Configuration Error', 'Missing admin credentials in environment variables', 500)
            }

            if (!JWT_SECRET) {
                console.error('Missing JWT secret in environment variables')
                return createErrorResponse('Configuration Error', 'Missing JWT secret in environment variables', 500)
            }

            console.log('Validating credentials...')
            if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
                console.warn('Invalid credentials provided for username:', username)
                return createErrorResponse('Unauthorized', 'Invalid credentials', 401)
            }

            console.log('Credentials validated successfully, generating JWT token...')
            const token = jwt.sign(
                { role: 'admin' },
                JWT_SECRET,
                { expiresIn: '1h' }
            )
            
            console.log('JWT token generated successfully')
            console.log('=== Authentication successful ===')
            
            return createSuccessResponse({
                message: 'Authentication successful',
                token: token
            })

        } catch (error) {
            console.error('=== Authentication error occurred ===')
            console.error('Error details:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
            return createErrorResponse('Authentication Error', 'Failed to authenticate admin', 500);
        }
    })


