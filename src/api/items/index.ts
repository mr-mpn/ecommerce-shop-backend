import middy from '@middy/core';
import { createErrorResponse, createSuccessResponse } from '../../middleware/response';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { connectToMongoDB, mongoose } from '../../middleware/mongo';

// Create schema and model once, outside the handler for better performance
const ItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    currency: String,
    description: String,
    image_url: String,
    category: String
});

// Get or create the model once
const getItemModel = () => {
    return mongoose.models.Item || mongoose.model('Item', ItemSchema, 'products');
};

export const getItemsHandler = middy()
    .handler(async (event: APIGatewayProxyEvent) => {
        try {
            // Connect to MongoDB
            await connectToMongoDB();
            console.log('API = /getItems')
            console.log('Starting to fetch items...');
            
            // Use the pre-created model
            const Item = getItemModel();
            
            // Fetch all items from your collection
            const items = await Item.find({}).limit(10);
            
            console.log(`Found ${items.length} items`);
            
            const response = {
                message: 'Items have been fetched from the db',
                items: items
            };
            
            return createSuccessResponse(response);
            
        } catch (error) {
            console.error('Items handler error:', error);
            return createErrorResponse('Database Error', 'Failed to fetch items', 500);
        }
    })