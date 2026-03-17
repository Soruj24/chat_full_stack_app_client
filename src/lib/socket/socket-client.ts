import { io, Socket } from "socket.io-client";

interface SocketWithUserId extends Socket {
  userId?: string;
}

class SocketService {
  private socket: SocketWithUserId | null = null;

  connect() {
    if (this.socket?.connected) return;

    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL || "https://chat-full-stack-app-server.onrender.com";
    console.log("Connecting to socket server at:", SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"], // Prefer websocket to avoid polling CORS/502 issues
      withCredentials: true,
      forceNew: true,
    }) as SocketWithUserId;

    this.socket.on("connect", () => {
      console.log("Connected to socket server with ID:", this.socket?.id);

      // Re-join user room on reconnection if userId is known
      const userId = this.socket?.userId;
      if (userId) {
        console.log("Re-joining room for user:", userId);
        this.socket?.emit("join", userId);
      }
    });

    this.socket.on("connect_error", (error) => {
      const err = error as Error & { type?: string; description?: string };
      console.error("Socket connection error detail:", {
        message: err.message,
        name: err.name,
        stack: err.stack,
        type: err.type,
        description: err.description,
      });
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server. Reason:", reason);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, callback: (...args: any[]) => void) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.socket?.on(event as any, callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.socket?.off(event as any, callback);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.socket?.off(event as any);
    }
  }

  emit(event: string, data: unknown) {
    // Keep track of userId for reconnection
    if (event === "join" && typeof data === "string" && this.socket) {
      this.socket.userId = data;
    }

    if (!this.socket?.connected) {
      console.warn(
        `Socket not connected, trying to reconnect before emitting ${event}`,
      );
      this.connect();

      // Use a one-time listener for 'connect' to emit the event once reconnected
      this.socket?.once("connect", () => {
        console.log(`Successfully reconnected, now emitting ${event}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.socket?.emit(event as any, data);
      });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.socket.emit(event as any, data);
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
