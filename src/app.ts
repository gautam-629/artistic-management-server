import express, { Request, Response } from 'express';

const app = express();


app.get('/',(req,res)=>{
     res.json({message:"Hello from Server"})
})

export default app;
