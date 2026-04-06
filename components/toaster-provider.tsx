"use client";

import { Toaster } from "sonner";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      closeButton
      richColors
      duration={4000}
      pauseWhenPageIsHidden
    />
  );
}
