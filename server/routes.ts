import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Serve portfolio static files (CSS, JS, JSON, assets)
  app.use('/src', express.static(path.resolve(import.meta.dirname, '..', 'src')));
  app.use('/assets', express.static(path.resolve(import.meta.dirname, '..', 'assets')));
  
  // Serve portfolio index.html for the root route
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(import.meta.dirname, '..', 'index.html'));
  });

  const httpServer = createServer(app);

  return httpServer;
}
