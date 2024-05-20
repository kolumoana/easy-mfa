"use client";

import { useState, useEffect, useRef } from "react";
import {
  TextInput,
  Box,
  Text,
  CopyButton,
  ActionIcon,
  Tooltip,
  rem,
  Group,
  Space,
  PinInput,
} from "@mantine/core";
import { IconCopy, IconCheck, IconEraser } from "@tabler/icons-react";
import { generateAuthCode } from "@/lib/authcode";
import { Result } from "neverthrow";

export const MFA = () => {
  const [backupCode, setBackupCode] = useState<string[]>(Array(8).fill(""));
  const [authCode, setAuthCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
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

  const handleBackupCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
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

  const clearBackupCode = () => {
    setBackupCode(Array(8).fill(""));
    setAuthCode("");
    setErrorMessage("");
    setTimeLeft(30);
  };

  const handleFocus = () => {
    inputRefs.current[0]?.focus();
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <Group
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {backupCode.map((code, index) => (
          <TextInput
            key={index}
            value={code}
            onPaste={handleBackupCodePaste}
            onFocus={handleFocus}
            style={{
              width: "60px",
              textAlign: "center",
              margin: "0 5px",
            }}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            maxLength={4}
            readOnly
          />
        ))}
      </Group>
      <Space h="md" />
      <Tooltip label="Clear All" withArrow position="right">
        <ActionIcon onClick={clearBackupCode} variant="subtle" color="gray">
          <IconEraser style={{ width: rem(16) }} />
        </ActionIcon>
      </Tooltip>
      {authCode && (
        <Box mt="20px">
          <Group>
            <Text size="xl">Authentication Code: {authCode}</Text>
            <CopyButton value={authCode} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Copied" : "Copy"}
                  withArrow
                  position="right"
                >
                  <ActionIcon
                    color={copied ? "teal" : "gray"}
                    variant="subtle"
                    onClick={copy}
                  >
                    {copied ? (
                      <IconCheck style={{ width: rem(16) }} />
                    ) : (
                      <IconCopy style={{ width: rem(16) }} />
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
          <Text size="sm" c="dimmed">
            Time Left: {timeLeft} seconds
          </Text>
        </Box>
      )}
      {errorMessage && (
        <Text size="sm" c="red">
          {errorMessage}
        </Text>
      )}
    </Box>
  );
};
