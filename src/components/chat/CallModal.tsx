"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  User,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "react-hot-toast";
import {
  endCall,
  toggleMic,
  toggleCamera,
  acceptCall,
  updateCallType,
} from "@/store/slices/callSlice";
import { cn } from "@/lib/utils";
import { webrtcService } from "@/lib/webrtc/webrtc-service";
import { socketService } from "@/lib/socket/socket-client";

export function CallModal() {
  const dispatch = useDispatch();
  const {
    isCallModalOpen,
    callType,
    callStatus,
    remoteUser,
    isMicMuted,
    isCameraOff,
    callStartTime,
  } = useSelector((state: RootState) => state.call);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isMaximized, setIsMaximized] = useState(false);
  const [callDuration, setCallDuration] = useState("00:00");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  // Helper function to safely get avatar source
  const getAvatarSrc = () => {
    if (!remoteUser) return `https://ui-avatars.com/api/?name=User`;

    // Check if avatar exists and is a non-empty string
    if (
      remoteUser.avatar &&
      typeof remoteUser.avatar === "string" &&
      remoteUser.avatar.trim() !== ""
    ) {
      return remoteUser.avatar;
    }
    // Fallback to UI Avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(remoteUser.name || "User")}`;
  };

  useEffect(() => {
    if (remoteStream) {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
      }
    }
  }, [remoteStream, callStatus]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === "connected" && callStartTime) {
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - callStartTime) / 1000);
        const mins = Math.floor(diff / 60)
          .toString()
          .padStart(2, "0");
        const secs = (diff % 60).toString().padStart(2, "0");
        setCallDuration(`${mins}:${secs}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus, callStartTime]);

  useEffect(() => {
    if (isCallModalOpen) {
      const setupCall = async () => {
        setErrorMessage(null);
        const stream = await webrtcService.getLocalStream(callType === "video");

        if (!stream) {
          const msg = "Microphone not found";
          setErrorMessage(msg);
          toast.error(msg);
          return;
        }

        // If video was requested but only audio is available
        const hasVideo = stream.getVideoTracks().length > 0;
        if (callType === "video" && !hasVideo) {
          console.log(
            "Video requested but camera not found, falling back to audio UI",
          );
          dispatch(updateCallType("audio"));
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        if (callStatus === "calling" && remoteUser && user?.id) {
          console.log("Initiating peer for outgoing call to:", remoteUser.id);
          const peer = webrtcService.createPeer(
            remoteUser.id,
            stream!,
            user.id,
          );

          peer.on("stream", (stream) => {
            console.log("Received remote stream (outgoing call)");
            setRemoteStream(stream);
          });
        }
      };
      setupCall();
    }

    socketService.on("call_accepted", (signal) => {
      console.log("Call accepted by remote user, finishing handshake");
      webrtcService.signalPeer(signal);
      dispatch(acceptCall());
    });

    socketService.on("call_ended", () => {
      console.log("Remote user ended the call");
      webrtcService.destroy();
      setRemoteStream(null);
      dispatch(endCall());
    });

    return () => {
      socketService.off("call_accepted");
      socketService.off("call_ended");
      socketService.off("receiving_returned_signal");
    };
  }, [isCallModalOpen, callStatus, remoteUser, dispatch]);

  if (!isCallModalOpen || !remoteUser) return null;

  const handleEndCall = () => {
    webrtcService.destroy();
    setRemoteStream(null);
    socketService.emit("end_call", { to: remoteUser.id });
    dispatch(endCall());
  };

  const handleAcceptCall = async () => {
    setErrorMessage(null);
    console.log("Accepting incoming call from:", remoteUser.id);
    const stream = await webrtcService.getLocalStream(callType === "video");

    if (!stream) {
      const msg = "Microphone not found";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    // If video was requested but only audio is available
    const hasVideo = stream.getVideoTracks().length > 0;
    if (callType === "video" && !hasVideo) {
      console.log(
        "Video requested but camera not found, falling back to audio UI",
      );
      dispatch(updateCallType("audio"));
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const incomingSignal = (
      window as unknown as { incomingSignal?: RTCSessionDescriptionInit }
    ).incomingSignal;
    if (incomingSignal) {
      const peer = webrtcService.answerPeer(
        incomingSignal,
        remoteUser.id,
        stream!,
      );
      peer.on("stream", (stream) => {
        console.log("Received remote stream (incoming call)");
        setRemoteStream(stream);
      });
      dispatch(acceptCall());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={cn(
        "fixed z-[200] bg-gray-900 text-white shadow-2xl transition-all duration-300 overflow-hidden",
        isMaximized
          ? "inset-0 rounded-0"
          : "bottom-4 right-4 w-[350px] h-[500px] rounded-3xl border border-gray-800",
      )}
    >
      {/* Background/Video Area */}
      <div className="absolute inset-0 z-0">
        {callType === "video" && callStatus === "connected" ? (
          <div className="relative w-full h-full bg-black">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Local Mini Video */}
            <div className="absolute top-4 right-4 w-24 h-36 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden z-10">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
            <div className="relative w-32 h-32 mb-6">
              <Image
                src={getAvatarSrc()}
                alt={remoteUser.name}
                fill
                unoptimized
                className="rounded-full object-cover ring-4 ring-blue-500/30"
              />
              {(callStatus === "calling" || callStatus === "incoming") && (
                <div className="absolute inset-[-8px] border-2 border-blue-500 rounded-full animate-ping opacity-20" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-1">{remoteUser.name}</h2>
            <div className="flex items-center gap-2 mb-2">
              {callType === "video" ? (
                <Video className="w-4 h-4 text-blue-400" />
              ) : (
                <Phone className="w-4 h-4 text-blue-400" />
              )}
              <span className="text-sm text-blue-400 uppercase tracking-wider font-semibold">
                {callType} Call
              </span>
            </div>
            {errorMessage ? (
              <p className="text-red-400 font-medium px-4 text-center">
                {errorMessage}
              </p>
            ) : (
              <p className="text-blue-400 font-medium animate-pulse">
                {callStatus === "calling"
                  ? "Calling..."
                  : callStatus === "incoming"
                    ? "Incoming Call..."
                    : callStatus === "connected"
                      ? callDuration
                      : "Call Ended"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={() => setIsMaximized(!isMaximized)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          {isMaximized ? (
            <Minimize2 className="w-5 h-5" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
        </button>
        {callType === "video" && callStatus === "connected" && (
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium">
            {callDuration}
          </div>
        )}
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 inset-x-0 p-8 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="flex items-center justify-center gap-10">
          {callStatus === "incoming" ? (
            <>
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleEndCall}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg shadow-red-500/30"
                >
                  <PhoneOff className="w-7 h-7 text-white" />
                </button>
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
                  Decline
                </span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleAcceptCall}
                  className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg shadow-green-500/30"
                >
                  <Phone className="w-7 h-7 text-white" />
                </button>
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
                  Accept
                </span>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => dispatch(toggleMic())}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95",
                  isMicMuted
                    ? "bg-red-500/20 text-red-500"
                    : "bg-white/10 hover:bg-white/20 text-white",
                )}
              >
                {isMicMuted ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleEndCall}
                className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg shadow-red-500/30"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              <button
                onClick={() => dispatch(toggleCamera())}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95",
                  isCameraOff
                    ? "bg-red-500/20 text-red-500"
                    : "bg-white/10 hover:bg-white/20 text-white",
                )}
              >
                {isCameraOff ? (
                  <VideoOff className="w-5 h-5" />
                ) : (
                  <Video className="w-5 h-5" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
      {/* hidden audio element for audio-call playback */}
      <audio ref={remoteAudioRef} autoPlay className="hidden" />
    </motion.div>
  );
}
