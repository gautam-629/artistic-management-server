import { IncomingMessage, ServerResponse } from 'http';
import { JwtToken } from '../util/jwtToken';
import { sendResponse } from '../util/sendResponse';

export class Authorize {
  private jwtToken: JwtToken;

  constructor() {
    this.jwtToken = new JwtToken();
  }

  public authorize(req: IncomingMessage, res: ServerResponse, roles: string[]): boolean {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendResponse(res, 401, 'Unauthorized: Missing or Invalid Token');
      return false;
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = this.jwtToken.verifyToken(token);
    } catch (err) {
      sendResponse(res, 401, 'Unauthorized: Invalid Token');
      return false;
    }

    if (!payload.role || !roles.includes(payload.role)) {
      sendResponse(res, 403, 'Forbidden: Insufficient Role');
      return false;
    }

    return true;
  }
}
