"use client";

import { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { AttachmentMenu } from "./input/AttachmentMenu";
import { ReplyPreview } from "./input/ReplyPreview";
import { VoiceRecorder } from "./input/VoiceRecorder";
import { InputActions } from "./input/InputActions";
import { SendButton } from "./input/SendButton";
import { TextInput } from "./input/TextInput";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onSendMedia?: (file: File) => void;
  onSendLocation?: () => void;
  onSendContact?: () => void;
  onSendVoice?: (file: File) => void;
  onTyping?: (isTyping: boolean) => void; // Added this
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  themeColor?: string;
}

export function MessageInput({
  value,
  onChange,
  onSendMessage,
  onSendMedia,
  onSendLocation,
  onSendContact,
  onSendVoice,
  replyingTo,
  onCancelReply,
  showEmojiPicker,
  setShowEmojiPicker,
  onTyping,
  themeColor
}: MessageInputProps) {
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value.trim()) {
      onTyping?.(true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        onTyping?.(false);
      }, 2000);
    } else {
      onTyping?.(false);
    }
  }, [value, onTyping]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Mock waveform data
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(20));

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveform(prev => prev.map(() => Math.floor(Math.random() * 30) + 5));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const handleSend = () => {
    if (value.trim()) {
      onSendMessage();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const startRecording = async () => {
    try {
      // Check for microphone availability first
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(device => device.kind === 'audioinput');
      
      if (!hasMic) {
        toast.error("No microphone found on your device");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], "voice_message.webm", { type: 'audio/webm' });
        const duration = formatTime(recordingTime);
        (file as File & { duration?: string }).duration = duration; // Add duration to file object
        onSendVoice?.(file);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone");
    }
  };

  const stopRecording = (cancel = false) => {
    if (!mediaRecorderRef.current) return;

    if (cancel) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    } else {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Auto-expand logic
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`; // max-h-32 (128px)
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  }, [value]);

  return (
    <footer className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800/50 p-2.5 md:p-3.5 z-20">
      <div className="max-w-4xl mx-auto relative flex flex-col gap-2">
        <AnimatePresence>
          <AttachmentMenu 
            isOpen={isAttachmentMenuOpen} 
            onClose={() => setIsAttachmentMenuOpen(false)} 
            onFileSelect={(file) => onSendMedia?.(file)}
            onLocationSelect={() => onSendLocation?.()}
            onContactSelect={() => onSendContact?.()}
          />
        </AnimatePresence>

        <AnimatePresence>
          {replyingTo && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="overflow-hidden"
            >
              <ReplyPreview 
                replyingTo={replyingTo} 
                onCancel={onCancelReply || (() => {})} 
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-end gap-2 md:gap-3">
          {!isRecording && (
            <div className="flex items-center mb-1">
              <InputActions 
                showEmojiPicker={showEmojiPicker}
                onEmojiPickerToggle={() => setShowEmojiPicker(!showEmojiPicker)}
                isAttachmentMenuOpen={isAttachmentMenuOpen}
                onAttachmentMenuToggle={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                themeColor={themeColor}
              />
            </div>
          )}
          
          <div className="flex-1 relative min-w-0 bg-gray-100 dark:bg-gray-800/40 rounded-2xl border border-transparent focus-within:border-blue-500/30 focus-within:bg-white dark:focus-within:bg-gray-800/60 transition-all duration-200 shadow-sm">
            <AnimatePresence mode="wait">
              {isRecording ? (
                <VoiceRecorder 
                  recordingTime={recordingTime}
                  waveform={waveform}
                  onCancel={() => stopRecording(true)}
                  formatTime={formatTime}
                  themeColor={themeColor}
                />
              ) : (
                <TextInput 
                  textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>} 
                  value={value} 
                  onChange={handleTextareaChange} 
                  onKeyDown={(e) => { 
                    if (e.key === 'Enter' && !e.shiftKey) { 
                      e.preventDefault(); 
                      handleSend(); 
                    } 
                  }} 
                />
              )}
            </AnimatePresence>
          </div>

          <div className="mb-1 flex items-center">
            <SendButton 
              isRecording={isRecording}
              hasValue={!!value.trim()}
              onSend={handleSend}
              onStartRecording={startRecording}
              onStopRecording={() => stopRecording(false)}
              themeColor={themeColor}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
