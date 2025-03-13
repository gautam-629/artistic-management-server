import { IncomingMessage, ServerResponse } from "http";

export function asyncWrapper(
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>
) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      await handler(req, res);
    } catch (error) {

      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };
}
