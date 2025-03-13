import { ServerResponse } from 'http';

export function sendResponse(res: ServerResponse, statusCode: number, message: string, data?: any) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    
    const response = {
        success: statusCode >= 200 && statusCode < 300,  
        message,
        data
    };

    res.end(JSON.stringify(response));
}
