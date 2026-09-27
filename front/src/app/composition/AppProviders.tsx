import { StrictMode } from "react";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "@tanstack/react-router";

import { router } from "../router";

import "@mantine/core/styles.css";

export function AppProviders() {
  return (
    <StrictMode>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </StrictMode>
  );
}
