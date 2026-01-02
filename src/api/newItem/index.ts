import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
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

// Get or create the model once - check if it exists first
const getItemModel = () => {
    return mongoose.models.Item || mongoose.model('Item', ItemSchema, 'products');
};

export const postNewItem = middy()
  .use(httpJsonBodyParser())
  .handler(async (event: APIGatewayProxyEvent) => {
    try {
      // Connect to MongoDB
      await connectToMongoDB();
      console.log('API = /newItem')
      console.log('Creating new item...');

      // Parse request body
      if (!event.body) {
        return createErrorResponse('Bad Request', 'Request body is required', 400);
      }


      let itemData;
      try {
        // Middy should have already parsed the JSON, but handle both cases
        itemData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return createErrorResponse('Bad Request', 'Invalid JSON format in request body', 400);
      }

      // Validate required fields
      const requiredFields = ['name', 'price', 'currency', 'description', 'image_url' , 'category'];
      const missingFields = requiredFields.filter(field => !itemData[field]);

      if (missingFields.length > 0) {
        return createErrorResponse('Bad Request', `Missing required fields: ${missingFields.join(', ')}`, 400);
      }

      // Validate data types
      if (typeof itemData.price !== 'number' || itemData.price <= 0) {
        return createErrorResponse('Bad Request', 'Price must be a positive number', 400);
      }

      // Use the pre-created model
      const Item = getItemModel();

      // Create new item
      const newItem = new Item({
        name: itemData.name,
        price: itemData.price,
        currency: itemData.currency,
        description: itemData.description,
        image_url: itemData.image_url,
        category: itemData.category
      });

      // Save to database
      const savedItem = await newItem.save();
      console.log(`Item created with ID: ${savedItem._id}`);

      const response = {
        message: 'Item created successfully',
        hasBeenAdded: true,
        item: savedItem
      };

      return createSuccessResponse(response);

    } catch (error) {
      console.error('Create item error:', error);
      return createErrorResponse('Database Error', 'Failed to create item', 500);
    }
  });