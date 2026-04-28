import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { createErrorResponse, createSuccessResponse } from '../../middleware/response';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { connectToMongoDB, mongoose } from '../../middleware/mongo';

const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  currency: String,
  description: String,
  image_url: String,
  category: String
});


// Get or create the model once - check if it exists first
const getItemModel = () => {
    return mongoose.models.Item || mongoose.model('Item', ItemSchema, 'products');
};


export const deleteItem = middy()
    .use(httpJsonBodyParser())
    .handler(async (event: APIGatewayProxyEvent) => {
        try{
            await connectToMongoDB();
            console.log('API = /removeItem')
            console.log('Deleting item...');
            if (!event.body) {
                return createErrorResponse('Bad Request', 'Request body is required', 400);
            }

            //console.log(event)
            const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
            const itemId = body.id;
            console.log(`the following id is going to be removed ${itemId}`);

            // deleting from the mongodb

            const MyModel = getItemModel();

            await MyModel.findByIdAndDelete(itemId);

            const response = {
                message: 'Item created removed',
                hasBeenRemoved: true,
                id: itemId
            };

            return createSuccessResponse(response);

        }catch(error){
            console.error('Create item error:', error);
            return createErrorResponse('Database Error', 'Failed to create item', 500);
        }
    })