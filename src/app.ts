import http from 'http';
import { testDbConnection } from './infrastructure/database/pgSql/data-source';

const app = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: "Hello from Server" }));
});

testDbConnection()

export default app;