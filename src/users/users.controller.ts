import { IncomingMessage, ServerResponse } from "http";
import { Userservice } from "./users.service";
import { getRequestBody } from "../common/util/requestUtils";
import { asyncWrapper } from "../common/util/asyncWrapper";
import { IUser } from "./users";
import { sendResponse } from "../common/util/sendResponse";
import { UserDTO } from "./users.dto";

export class UserController{
    constructor(private userService:Userservice){}

    handleRequest(req:IncomingMessage,res:ServerResponse){
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const path = url.pathname;
        const id=path.split('/')[2]

            if(req.method === 'POST' && path === '/users'){
              return asyncWrapper(this.createUser.bind(this))(req, res);
            }else if(req.method==='GET' && id){
              return asyncWrapper(this.getUserById.bind(this))(req, res);
            }
            else if(req.method === 'GET' && !id){
              return asyncWrapper(this.getUsers.bind(this))(req, res);
            }
            else if (req.method === 'DELETE' && id){
              return asyncWrapper(this.deleteUser.bind(this))(req, res);
            }
            else if (req.method === 'PUT' && id){
              return asyncWrapper(this.updateUser.bind(this))(req, res);
            }
            else {
                sendResponse(res,405,"Method Not Allowed")
              }
    }

    async createUser(req: IncomingMessage, res: ServerResponse) {
        const user:IUser = await getRequestBody(req);

        if (!user.first_name || !user.last_name || !user.email || !user.phone || !user.gender || !user.dob ||!user.address || !user.password

        ) {
          sendResponse(res, 400, 'Missing required fields');
          return;
        }
    
        const newUser = await this.userService.createUser(user);

        const userDto=UserDTO.fromUser(newUser)

        sendResponse(res,201,'User created successfully',userDto)

      }

    async getUserById(req:IncomingMessage,res:ServerResponse){
      
      const urlParts = req.url?.split('/');
      const id = urlParts ? urlParts[urlParts.length - 1] : null;
      
      const user= await this.userService.getUserByEmail(id as string);

      if(!user){
          sendResponse(res,404,'User not found')
          return;
      }

      const userDto=UserDTO.fromUser(user)

      sendResponse(res,200,'User find scccessfully',userDto)

    }

    async getUsers(req:IncomingMessage,res:ServerResponse){
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const page = Number(url.searchParams.get('page')) || 1;
      const limit = Number(url.searchParams.get('limit')) || 10;

      const users = await this.userService.getUsers(page, limit);

      const userDto=UserDTO.fromUsers(users.data)

      sendResponse(res,200,"User find Sucessfully",{users:userDto,meta:users.pagination})

    }

    async deleteUser(req:IncomingMessage,res:ServerResponse){{
      const urlParts = req.url?.split('/');
      const id = urlParts ? urlParts[urlParts.length - 1] : null;
      const deletedUser= await this.userService.deleteUser(id as string)

      if(!deletedUser){
        sendResponse(res,404,'User not found')
        return;
      }
      sendResponse(res,200,'User deleted successfully',{id:deletedUser.id})
      return;

    }}

   async updateUser(req:IncomingMessage,res:ServerResponse){
    const urlParts = req.url?.split('/');
    const id = urlParts ? urlParts[urlParts.length - 1] : null;
    const user = await getRequestBody(req);
     const updateUser=this.userService.updateUser(id as string,user)
     if(!updateUser){
        sendResponse(res,404,'User not found')
     }
     sendResponse(res,200,"User update successfully",updateUser)
    }
}

