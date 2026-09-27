import { createRoot } from "react-dom/client";
import { initApi } from "@/app/init/api";
import { AppProviders } from "@/app/composition/AppProviders";
import { initSentry } from "@/app/init/sentry";
import "@/app/styles/index.css";

initSentry();

initApi();

createRoot(document.getElementById("root")!).render(<AppProviders />);
