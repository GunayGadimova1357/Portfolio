"use client";

import {useEffect, useRef, useState} from "react";

export function useStatusMessage() {
  // Короткое сообщение для операций create/update/delete в dashboard.
  const [status, setStatus] = useState("");
  // Храним один таймер, чтобы новое сообщение сбрасывало старое корректно.
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
    // При уходе со страницы очищаем таймер, чтобы не было обновления после unmount.
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {status, showStatus};
}
