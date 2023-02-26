import express from "express";

declare module "express-session" {
  interface Session {
    userId?: string;
  }
}

export interface Context {
  req: express.Request;
  res: express.Response;
}
