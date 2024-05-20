import type { Metadata } from "next";
import type { Viewport } from "next";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

export const metadata: Metadata = {
  title: "Easy MFA",
  description: "Easy MFA",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" style={{ backgroundColor: "#fff" }}>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
};

export default RootLayout;
