import { IncomingMessage, ServerResponse } from "http";
import { Userservice } from "./users.service";
import { getRequestBody } from "../common/util/requestUtils";
import { asyncWrapper } from "../common/util/asyncWrapper";
import { IUser } from "./users";
import { sendResponse } from "../common/util/sendResponse";

export class UserController{
    constructor(private userService:Userservice){}

    handleRequest(req:IncomingMessage,res:ServerResponse){
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const path = url.pathname;

            if(req.method === 'POST' && path === '/users'){
              return asyncWrapper(this.createUser.bind(this))(req, res);
            }
            else {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              }
    }

    async createUser(req: IncomingMessage, res: ServerResponse) {
        const user:IUser = await getRequestBody(req);

        if (!user.first_name || !user.last_name || !user.email || !user.role || !user.phone || !user.gender || !user.dob ||!user.address) {
          sendResponse(res, 400, 'Missing required fields');
          return;
        }
    
        const newUser = await this.userService.createUser(user);

        sendResponse(res,201,'User created successfully',{id:newUser.id})

      }

}

