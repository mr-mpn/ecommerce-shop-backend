// this middleware is going to take in the token from the request header and then validate it

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import { APIGatewayProxyEvent } from 'aws-lambda';

dotenv.config();

interface DecodedToken {
    role: string;
    iat?: number;
    exp?: number;
}

export const authAdminPanel = (event: APIGatewayProxyEvent): boolean => {
    try {
        console.log('=== Starting admin panel authentication ===')
        
        const authHeader = event.headers?.authorization || event.headers?.Authorization
        console.log('Authorization header present:', !!authHeader)
        
        if (!authHeader) {
            console.error('Missing Authorization header')
            return false
        }

        if (!authHeader.startsWith('Bearer ')) {
            console.error('Invalid Authorization format - must start with "Bearer "')
            return false
        }

        const token = authHeader.replace('Bearer ', '')
        console.log('Token extracted successfully')

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.error('JWT secret not configured in environment variables')
            return false
        }

        console.log('Verifying JWT token...')
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
        
        console.log('Token decoded successfully:', { role: decoded.role })
        
        // Validate that the token has admin role
        if (decoded.role !== 'admin') {
            console.error('Token does not have admin role:', decoded.role)
            return false
        }

        console.log('=== Admin authentication successful ===')
        return true

    } catch (error) {
        console.error('=== Admin authentication failed ===')
        console.error('Authentication error:', error);
        
        if (error instanceof jwt.JsonWebTokenError) {
            console.error('JWT Error:', error.message)
        } else if (error instanceof jwt.TokenExpiredError) {
            console.error('Token expired:', error.message)
        }
        
        return false
    }
}