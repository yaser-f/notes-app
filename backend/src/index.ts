import { ApolloServer } from "apollo-server-express";
// import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import session from "express-session";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";
import { getConnectionOptions, createConnection } from "typeorm";

async function listen(port: number) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  await server.start();

  const connOptions = await getConnectionOptions();

  const conn = await createConnection(connOptions);

  await conn.runMigrations();

  const app = express();

  app.use(
    session({
      name: "qq",
      secret: "lhbbbljb&^*(5465",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  const httpServer = http.createServer(app);

  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: ["http://localhost:3000", "http://localhost:4000"],
    },
  });

  return new Promise((resolve, reject) => {
    httpServer.listen(port).once("listening", resolve).once("error", reject);
  });
}

async function main() {
  try {
    await listen(4000);
    console.log("🚀 Server is ready at http://localhost:4000/graphql");
  } catch (err) {
    console.error("💀 Error starting the node server", err);
  }
}

void main();
