import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import { app, setBroadcastHandler } from "./server/app";

const PORT = 3000;

// WebSocket connections
const activeSockets = new Set<WebSocket>();

setBroadcastHandler((event: string, payload: unknown) => {
  const data = JSON.stringify({ event, payload });
  activeSockets.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
});

async function startServer() {
  const server = http.createServer(app);

  // Initialize WebSocket Server on /ws
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    activeSockets.add(ws);

    // Initial greeting
    ws.send(
      JSON.stringify({
        event: "connected",
        payload: { status: "connected" },
      })
    );

    ws.on("message", (raw) => {
      try {
        const parsed = JSON.parse(raw.toString());
        if (parsed.type === "ping") {
          ws.send(JSON.stringify({ event: "pong" }));
        }
      } catch (e) {
        // ignore malformed
      }
    });

    ws.on("close", () => {
      activeSockets.delete(ws);
    });

    ws.on("error", () => {
      activeSockets.delete(ws);
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[TOMO] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
