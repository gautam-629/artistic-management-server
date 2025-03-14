import http, { IncomingMessage, ServerResponse } from 'http';
import { testDbConnection } from './config/data-source';
import { UserController } from './users/users.controller';
import { Userservice } from './users/users.service';
import { sendResponse } from './common/util/sendResponse';
import { AuthController } from './auth/auth.controller';
import { JwtToken } from './common/util/jwtToken';
import { Authorize } from './common/middleware/authorize';

const userservice = new Userservice();
const userController = new UserController(userservice, new Authorize());
const authController = new AuthController(userservice, new JwtToken());
const app = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const path = req.url?.split('/')[1];

  //cors
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/' && req.method === 'GET') {
    sendResponse(res, 200, 'Welcome to the API');
    return;
  }

  if (path === 'users') {
    await userController.handleRequest(req, res);
  } else if (path === 'auth') {
    await authController.handleRequest(req, res);
  } else {
    sendResponse(res, 404, 'Not Found');
  }
});

testDbConnection();

export default app;
