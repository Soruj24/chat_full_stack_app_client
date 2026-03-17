import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CallType = 'audio' | 'video';
export type CallStatus = 'idle' | 'calling' | 'incoming' | 'connected' | 'ended';

interface CallState {
  isCallModalOpen: boolean;
  callType: CallType | null;
  callStatus: CallStatus;
  remoteUser: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  isMicMuted: boolean;
  isCameraOff: boolean;
  callStartTime: number | null;
}

const initialState: CallState = {
  isCallModalOpen: false,
  callType: null,
  callStatus: 'idle',
  remoteUser: null,
  isMicMuted: false,
  isCameraOff: false,
  callStartTime: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    initiateCall: (state, action: PayloadAction<{ user: { id: string; name: string; avatar: string }, type: CallType }>) => {
      state.isCallModalOpen = true;
      state.callType = action.payload.type;
      state.callStatus = 'calling';
      state.remoteUser = action.payload.user;
      state.isMicMuted = false;
      state.isCameraOff = false; // Initially assume camera is available for video call
    },
    updateCallType: (state, action: PayloadAction<CallType>) => {
      state.callType = action.payload;
      if (action.payload === 'audio') {
        state.isCameraOff = true;
      }
    },
    receiveCall: (state, action: PayloadAction<{ user: { id: string; name: string; avatar: string }, type: CallType }>) => {
      state.isCallModalOpen = true;
      state.callType = action.payload.type;
      state.callStatus = 'incoming';
      state.remoteUser = action.payload.user;
    },
    acceptCall: (state) => {
      state.callStatus = 'connected';
      state.callStartTime = Date.now();
    },
    endCall: (state) => {
      state.isCallModalOpen = false;
      state.callType = null;
      state.callStatus = 'idle';
      state.remoteUser = null;
      state.callStartTime = null;
    },
    toggleMic: (state) => {
      state.isMicMuted = !state.isMicMuted;
    },
    toggleCamera: (state) => {
      state.isCameraOff = !state.isCameraOff;
    },
  },
});

export const { 
  initiateCall, 
  receiveCall, 
  acceptCall, 
  updateCallType,
  endCall, 
  toggleMic, 
  toggleCamera 
} = callSlice.actions;

export default callSlice.reducer;
