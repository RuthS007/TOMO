import { useState, useEffect, useRef, useCallback } from "react";

export interface WebSocketEvent<T = unknown> {
  event: string;
  payload: T;
}

export function useRealtime(onEvent?: (event: string, payload: unknown) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    // Limit reconnect attempts on platforms without WebSocket server (e.g., static Vercel)
    if (retryCountRef.current > 4) {
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
        } catch (e) {
          // parse error
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        retryCountRef.current += 1;
        if (retryCountRef.current <= 4) {
          const backoff = Math.min(10000, 2000 * retryCountRef.current);
          setTimeout(() => {
            if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
              connect();
            }
          }, backoff);
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch (err) {
      // quiet fallback
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
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
