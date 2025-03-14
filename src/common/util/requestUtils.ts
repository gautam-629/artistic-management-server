export async function getRequestBody(req: any) {
  return new Promise<any>((resolve, reject) => {
    let body = '';

    req.on('data', (chunk: string) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body || '{}');
        resolve(parsedBody);
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    });

    req.on('error', (error: any) => {
      reject(new Error('Error reading request body'));
    });
  });
}
