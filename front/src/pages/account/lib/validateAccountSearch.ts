import type { AccountSearch } from "../model/types";

export const validateAccountSearch = (
  search: Record<string, unknown>,
): AccountSearch => {
  const page = Number(search["page"]);
  return { page: Number.isInteger(page) && page > 0 ? page : 1 };
};
