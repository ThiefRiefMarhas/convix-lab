import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Route imports
import chatRouter from "./server/routes/chat.js";
import conversationsRouter from "./server/routes/conversations.js";
import uploadRouter from "./server/routes/upload.js";
import transcribeRouter from "./server/routes/transcribe.js";
import exportRouter from "./server/routes/export.js";
import swotRouter from "./server/routes/swot.js";
import sourcesRouter from "./server/routes/sources.js";
import analyticsRouter from "./server/routes/analytics.js";
import insightsRouter from "./server/routes/insights.js";

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
  app.use('/api/transcribe', transcribeRouter);
  app.use('/api/export', exportRouter);
  app.use('/api/swot', swotRouter);
  app.use('/api/sources', sourcesRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/insights', insightsRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false })); // Disable default index serve to let our custom catch-all handle it
    
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      fs.readFile(indexPath, 'utf8', (err, html) => {
        if (err) {
          console.error('[Index Serve Error]:', err);
          return res.status(500).send('Error loading index.html');
        }
        
        const injected = html
          .replace('__VITE_SUPABASE_URL__', process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '')
          .replace('__VITE_SUPABASE_ANON_KEY__', process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '');
          
        res.setHeader('Content-Type', 'text/html');
        res.send(injected);
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Convix Server running on http://localhost:${PORT}`);
  });
}

startServer();
