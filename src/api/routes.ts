import { Route } from '@middy/http-router';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getHealthHandler } from "./health";
import { getItemsHandler} from './items';
import { postNewItem } from './newItem';
import { deleteItem } from './removeItem';
import { updateItem } from './updateItem';
import { postAuthenticateLoginAdmin } from './authLoginAdmin';

export const routes: Route<APIGatewayProxyEvent>[] = [
  {
    method: 'GET',
    path: '/health',
    handler: getHealthHandler
  },
  {
    method: 'GET',
    path: '/getItems',
    handler: getItemsHandler
  },
  {
    method: 'POST',
    path: '/newItem',
    handler: postNewItem
  },
  {
    method: 'DELETE',
    path: '/removeItem',
    handler: deleteItem
  },
  {
    method: 'PUT',
    path: '/updateItem',
    handler: updateItem
  },
  {
    method: 'POST',
    path: '/authLoginAdmin',
    handler: postAuthenticateLoginAdmin
  }
]