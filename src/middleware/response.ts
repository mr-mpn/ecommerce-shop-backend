import { APIGatewayProxyResult } from "aws-lambda";

export const createSuccessResponse = (data: any, statusCode: number = 200): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
  }
});

export const createErrorResponse = (error: string, message?: string, statusCode: number = 500): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify({
    error,
    message: message || 'An error occurred'
  }),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
  }
});