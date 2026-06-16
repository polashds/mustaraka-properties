"use client";
import { useEffect } from "react";
import { trackPixelViewContent } from "@/lib/analytics";
export default function ViewContentTracker({ name }: { name?: string }) {
  useEffect(() => { trackPixelViewContent(name); }, [name]);
  return null;
}
