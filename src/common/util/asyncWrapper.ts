import { IncomingMessage, ServerResponse } from "http";
import { sendResponse } from "./sendResponse";

export function asyncWrapper(
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>
) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
     sendResponse(res,500,'Internal Server Error')
    }
  };
}
