import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Route imports
import chatRouter from "./server/routes/chat.js";
import conversationsRouter from "./server/routes/conversations.js";
import uploadRouter from "./server/routes/upload.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Middleware
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.use('/api/chat', chatRouter);
  app.use('/api/conversations', conversationsRouter);
  app.use('/api/upload', uploadRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Convix Server running on http://localhost:${PORT}`);
  });
}

startServer();
