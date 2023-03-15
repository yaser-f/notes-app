// import { ApolloServer } from "apollo-server-express";
// import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from 'express';
// import http from "http";
import session from 'express-session';
import { getConnectionOptions, createConnection } from 'typeorm';
import cors from 'cors';
// import * as routes from './routes';
const routes = require('./routes');

const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.log('Middleware Error Hadnling');
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
};

async function listen(port: number) {
  const connOptions = await getConnectionOptions();

  const conn = await createConnection(connOptions);

  await conn.runMigrations();

  const app = express();

  app.use(
    session({
      name: 'qq',
      secret: 'lhbbblsfjbasdfdf&^*(5465',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:5173',
    })
  );

  app.use(express.json());

  app.use(routes as any);

  app.use(errorHandler);

  app.listen(port);

  return true;
  // const httpServer = http.createServer(app);

  // return new Promise((resolve, reject) => {
  //   httpServer.listen(port).once("listening", resolve).once("error", reject);
  // });
}

async function main() {
  try {
    await listen(4000);
    console.log('🚀 Server is ready at http://localhost:4000');
  } catch (err) {
    console.error('💀 Error starting the node server', err);
  }
}

void main();