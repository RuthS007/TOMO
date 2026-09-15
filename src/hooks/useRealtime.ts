import { useState, useEffect, useRef, useCallback } from "react";

export interface WebSocketEvent<T = unknown> {
  event: string;
  payload: T;
}

export function useRealtime(onEvent?: (event: string, payload: unknown) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;
  const retryCountRef = useRef(0);
  const timerRef = useRef<any>(null);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;
    if (retryCountRef.current > 3) {
      // Graceful fallback for static environments like Vercel where WebSockets aren't hosted
      return;
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        retryCountRef.current = 0;
      };

      ws.onmessage = (messageEvent) => {
        try {
          const parsed = JSON.parse(messageEvent.data);
          if (parsed.event && onEventRef.current) {
            onEventRef.current(parsed.event, parsed.payload);
          }
        } catch {
          // Ignore parse errors
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        retryCountRef.current += 1;
        if (retryCountRef.current <= 3) {
          timerRef.current = setTimeout(() => {
            if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
              connect();
            }
          }, 3000 * retryCountRef.current);
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch {
      // Ignore initial connection errors on static hosting
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((type: string, data?: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  }, []);

  return { isConnected, send };
}
