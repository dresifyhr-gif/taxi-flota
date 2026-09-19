"use client";

import { useEffect } from "react";

export function NoRightClick() {
  useEffect(() => {
    const blockContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", blockContext);

    return () => {
      document.removeEventListener("contextmenu", blockContext);
    };
  }, []);

  return null;
}
