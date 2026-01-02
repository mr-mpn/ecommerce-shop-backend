import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { createErrorResponse, createSuccessResponse } from '../../middleware/response';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { connectToMongoDB, mongoose } from '../../middleware/mongo';

interface UpdateItemBody {
  id: string;
  name?: string;
  price?: number;
  currency?: string;
  description?: string;
  image_url?: string;
}


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

export const updateItem = middy()
    .use(httpJsonBodyParser())
    .handler(async (event: APIGatewayProxyEvent) => {
      
      await connectToMongoDB();
      console.log('API = /updateItem')
      console.log('Updating item...');
      const body = event.body as unknown as UpdateItemBody;
      const { id, ...updateData } = body; 
      console.log('filed extracted')

      const MyModel = getItemModel();
      const updated = await MyModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      const response = {
                message: 'Item updates',
                hasBeenupdated: true,
                id: id
            };
      return createSuccessResponse(response);
    })
