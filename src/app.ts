import http, { IncomingMessage, ServerResponse } from 'http';
import { testDbConnection } from './config/data-source';
import { UserController } from './users/users.controller';
import { Userservice } from './users/users.service';

const userController=new UserController(new Userservice())

const app = http.createServer(async (req:IncomingMessage, res:ServerResponse) => {

  const path=req.url?.split('/')[1];

  //cors
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return;
  }

  if (path === 'users') {
    await userController.handleRequest(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }

});

testDbConnection()

export default app;