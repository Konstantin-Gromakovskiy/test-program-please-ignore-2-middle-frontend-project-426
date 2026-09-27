import { createRoot } from "react-dom/client";

import { AppProviders } from "@/app/composition/AppProviders";
import { initSentry } from "@/app/init/sentry";
import "@/app/styles/index.css";

initSentry();

createRoot(document.getElementById("root")!).render(
  <AppProviders />,
);
