"use client";

import { Suspense } from "react";
import { AuthContent } from "./AuthContent";

export function Auth() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
