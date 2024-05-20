"use client";

import { useState, useEffect, ClipboardEvent, useRef } from "react";
import { generateAuthCode } from "@/lib/authcode";
import { Result } from "neverthrow";

export const useAuthCode = () => {
  const [authCode, setAuthCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [backupCode, setBackupCode] = useState<string[]>(Array(8).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(8).fill(null));

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (authCode && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && backupCode.join("").length === 32) {
      handleAuthCode(backupCode.join(""));
    }

    return () => clearInterval(timer);
  }, [authCode, timeLeft, backupCode]);

  const handleAuthCode = (secret: string) => {
    const removedSpace = secret.replace(/\s/g, "");
    const result: Result<{ code: string; remaining: number }, Error> =
      generateAuthCode(removedSpace);

    result.match(
      ({ code, remaining }) => {
        setAuthCode(code);
        setTimeLeft(remaining);
        setErrorMessage("");
      },
      (error) => {
        setAuthCode("");
        setTimeLeft(0);
        clearBackupCode();
        setErrorMessage(error.message);
      }
    );
  };

  const clearBackupCode = () => {
    setBackupCode(Array(8).fill(""));
    setAuthCode("");
    setErrorMessage("");
    setTimeLeft(30);
  };

  const handleBackupCodePaste = (
    e: ClipboardEvent<HTMLInputElement>,
    backupCode: string[],
    setBackupCode: (codes: string[]) => void,
    handleAuthCode: (code: string) => void
  ) => {
    const pasteData = e.clipboardData.getData("text").replace(/\s/g, "");
    const splitData = pasteData.match(/.{1,4}/g) || [];
    const newBackupCode = [...backupCode];

    for (let i = 0; i < splitData.length && i < 8; i++) {
      newBackupCode[i] = splitData[i];
    }

    setBackupCode(newBackupCode);
    handleAuthCode(newBackupCode.join(""));
    e.preventDefault();
  };

  const handleFocus = () => {
    inputRefs.current[0]?.focus();
  };

  return {
    authCode,
    backupCode,
    errorMessage,
    timeLeft,
    inputRefs,
    handleAuthCode,
    setBackupCode,
    clearBackupCode,
    handleBackupCodePaste,
    handleFocus,
  };
};
