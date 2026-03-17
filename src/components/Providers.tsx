"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { CallModal } from "./chat/CallModal";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <CallModal />
      <Toaster />
    </Provider>
  );
}
