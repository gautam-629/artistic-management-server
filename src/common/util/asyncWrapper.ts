import { IncomingMessage, ServerResponse } from "http";
import { sendResponse } from "./sendResponse";
import {CustomError} from '../util/ErrorHandler'
export function asyncWrapper(
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>
) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      await handler(req, res);
    } catch (error:any) {
    if(error instanceof CustomError){
      sendResponse(res,error.statusCode,error.message)
    }

     else if(error instanceof Error){
        sendResponse(res,500,error.message)
        return;
      }
      else{
        sendResponse(res,500,'Internal Server Error')
         return
      }

     
    }
  };
}
