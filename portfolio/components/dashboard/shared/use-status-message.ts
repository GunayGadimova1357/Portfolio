"use client";

import {useEffect, useRef, useState} from "react";

export function useStatusMessage() {
  const [status, setStatus] = useState("");
  const timeoutRef = useRef<number | null>(null);

  function showStatus(message: string) {
    setStatus(message);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setStatus("");
      timeoutRef.current = null;
    }, 3000);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {status, showStatus};
}
