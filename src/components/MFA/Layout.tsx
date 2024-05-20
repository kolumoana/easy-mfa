"use client";

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
} from "@mantine/core";
import { IconCopy, IconCheck, IconEraser } from "@tabler/icons-react";
import { useAuthCode } from "./hooks";

export const Layout = () => {
  const {
    authCode,
    backupCode,
    errorMessage,
    timeLeft,
    inputRefs,
    handleAuthCode,
    setBackupCode,
    handleFocus,
    clearBackupCode,
    handleBackupCodePaste,
  } = useAuthCode();

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
            onPaste={(e) =>
              handleBackupCodePaste(
                e,
                backupCode,
                setBackupCode,
                handleAuthCode
              )
            }
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
