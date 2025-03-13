import { IncomingMessage, ServerResponse } from "http";
import { Userservice } from "../users/users.service";
import { asyncWrapper } from "../common/util/asyncWrapper";
import { sendResponse } from "../common/util/sendResponse";
import { getRequestBody } from "../common/util/requestUtils";
import { IUser } from "../users/users";
import { UserDTO } from "../users/users.dto";

export class AuthController{
     constructor( private userService:Userservice){}

      handleRequest(req:IncomingMessage,res:ServerResponse){
             const url = new URL(req.url || '', `http://${req.headers.host}`);
             const path = url.pathname;
             const id=path.split('/')[2]
     
                 if(req.method === 'POST' && path === '/auth/register'){
                   return asyncWrapper(this.regiser.bind(this))(req, res);
                 }
                 else {
                     sendResponse(res,405,"Method Not Allowed")
                   }
         }

         async regiser(req:IncomingMessage,res:ServerResponse){
             const user:IUser = await getRequestBody(req);
            
             if (!user.first_name || !user.last_name || !user.email || !user.phone || !user.gender || !user.dob ||!user.address) {
                      sendResponse(res, 400, 'Missing required fields');
                      return;
                    }
                
                    const newUser = await this.userService.createUser(user);
            
                    const userDto=UserDTO.fromUser(newUser)
            
                    sendResponse(res,201,'User register successfully',userDto)
            
         }
}