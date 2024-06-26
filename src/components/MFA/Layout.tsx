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
import { useMFA } from "./hooks";

export const Layout = () => {
  const {
    authCode,
    backupCode,
    errorMessage,
    timeLeft,
    inputRefs,
    handleFocus,
    clearBackupCode,
    handleBackupCodePaste,
  } = useMFA();

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
            onPaste={(e) => handleBackupCodePaste(e)}
            onFocus={handleFocus}
            ta="center"
            m="0px"
            w="67px"
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            maxLength={4}
            readOnly={index !== 0}
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
