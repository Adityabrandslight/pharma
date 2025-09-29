"use client";

import { useState, useEffect } from "react";

export function ToastNotification({ message, duration = 2000 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  return (
    show && (
      <div
        className="fixed top-4 right-4 p-4  text-green-500 "
        style={{ zIndex: 9999 }}
      >
        {message}
      </div>
    )
  );
}
