import type { ReactNode } from "react";
import { Box, Container } from "@mantine/core";

import { Header } from "@/widgets/header";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box mih="100svh" display="flex" style={{ flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, minHeight: 0, display: "flex" }}>
        <Container size={1600} style={{ flex: 1 }}>
          {children}
        </Container>
      </main>
    </Box>
  );
}
