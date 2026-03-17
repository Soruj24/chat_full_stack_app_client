"use client";

import Peer from "simple-peer";
import { socketService } from "../socket/socket-client";

export class WebRTCService {
  private peer: Peer.Instance | null = null;
  private stream: MediaStream | null = null;

  async getLocalStream(video: boolean = true) {
    if (this.stream) {
      // If existing stream doesn't match the requested video state, stop it and get a new one
      const hasVideo = this.stream.getVideoTracks().length > 0;
      if (hasVideo === video) return this.stream;

      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    try {
      // Check available devices first to avoid NotFoundError
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((device) => device.kind === "videoinput");
      const hasMic = devices.some((device) => device.kind === "audioinput");

      if (!hasMic && !hasCamera) {
        console.warn("No audio or video devices found");
        return null;
      }

      // Adjust constraints based on available hardware
      const constraints = {
        video: video && hasCamera,
        audio: hasMic,
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.stream;
    } catch (error: unknown) {
      // Only log if it's not a common "not found" error, or handle silently
      if (
        error instanceof Error &&
        error.name !== "NotFoundError" &&
        error.name !== "DevicesNotFoundError"
      ) {
        console.error("Error accessing media devices:", error);
      }

      // Fallback: If we failed to get video+audio, try just audio if it's available
      if (video) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasMic = devices.some((device) => device.kind === "audioinput");

          if (hasMic) {
            this.stream = await navigator.mediaDevices.getUserMedia({
              video: false,
              audio: true,
            });
            return this.stream;
          }
        } catch (audioError) {
          // Silent failure for fallback
        }
      }

      return null;
    }
  }

  createPeer(userIdToCall: string, stream: MediaStream, currentUserId: string) {
    this.peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    this.peer.on("signal", (data) => {
      console.log("Peer signaling (initiator):", data.type);
      socketService.emit("call_user", {
        userToCall: userIdToCall,
        signalData: data,
        from: currentUserId,
        type: stream.getVideoTracks().length > 0 ? "video" : "audio",
      });
    });

    return this.peer;
  }

  answerPeer(
    incomingSignal: Peer.SignalData,
    callerId: string,
    stream: MediaStream,
  ) {
    this.peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    this.peer.on("signal", (data) => {
      console.log("Peer signaling (responder):", data.type);
      socketService.emit("answer_call", {
        signal: data,
        to: callerId,
      });
    });

    this.peer.signal(incomingSignal);
    return this.peer;
  }

  signalPeer(signal: Peer.SignalData) {
    if (this.peer) {
      console.log("Signaling existing peer with type:", signal.type);
      this.peer.signal(signal);
    } else {
      console.error("No peer exists to signal");
    }
  }

  destroy() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }
}

export const webrtcService = new WebRTCService();
