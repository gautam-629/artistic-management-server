import { IncomingMessage, ServerResponse } from "http";
import { Userservice } from "../users/users.service";
import { asyncWrapper } from "../common/util/asyncWrapper";
import { sendResponse } from "../common/util/sendResponse";
import { getRequestBody } from "../common/util/requestUtils";
import { IUser } from "../users/users";
import { UserDTO } from "../users/users.dto";
import { JwtToken } from "../common/util/jwtToken";
import bcrypt from 'bcryptjs';

export class AuthController{
     constructor( 
      private userService:Userservice,
      private jwtToken:JwtToken
    ){}

      handleRequest(req:IncomingMessage,res:ServerResponse){
             const url = new URL(req.url || '', `http://${req.headers.host}`);
             const path = url.pathname;
             const id=path.split('/')[2]
     
                 if(req.method === 'POST' && path === '/auth/register'){
                   return asyncWrapper(this.regiser.bind(this))(req, res);
                 }
                 if(req.method === 'POST' && path === '/auth/login'){
                  return asyncWrapper(this.login.bind(this))(req, res);
                }
                 else {
                     sendResponse(res,405,"Method Not Allowed")
                   }
         }

         async regiser(req:IncomingMessage,res:ServerResponse){
             const user:IUser = await getRequestBody(req);
            
             if (!user.first_name || !user.last_name || !user.email || !user.phone || !user.gender || !user.dob ||!user.address || !user.password) {
                      sendResponse(res, 400, 'Missing required fields');
                      return;
                    }
                
                    const newUser = await this.userService.createUser(user);
            
                    const userDto=UserDTO.fromUser(newUser)
            
                    sendResponse(res,201,'User register successfully',userDto)
            
         }

         async login(req:IncomingMessage,res:ServerResponse){

          const userData:IUser = await getRequestBody(req);

          if ( !userData.email || !userData.password) {
            sendResponse(res, 400, 'Missing required fields');
            return;
          }
      

          const user= await this.userService.getUserByEmail(userData.email);

          if(!user){
            sendResponse(res,401,"email or Password Wrong!")
            return;
          }

          const isPasswordValid=await bcrypt.compare(userData.password,user.password);

          if(!isPasswordValid){
            sendResponse(res,401,"email or Password Wrong!")
            return;
          }

          const payload = { 
            sub: user.id,
            role:user.role
        };

        const token = this.jwtToken.generateToken(payload)
            
        const userDto=UserDTO.fromUser(user)

        sendResponse(res,201,'User login successfully',{user:userDto,token:token})
      }

}