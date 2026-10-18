import { createFileRoute } from "@tanstack/react-router";
import { AccountPage, validateAccountSearch } from "@/pages/account";

export const Route = createFileRoute("/_authenticated/account")({
  validateSearch: validateAccountSearch,
  component: AccountPage,
});
