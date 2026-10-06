const CONTROL_TEST_IDS = {
  previous: "catalog-page-prev",
  next: "catalog-page-next",
} as const;

/** Проставляет test-id кнопкам «назад» и «вперёд» пагинации. */
export const getPaginationControlProps = (
  control: "first" | "previous" | "last" | "next" | "dots" | number,
) => {
  if (control === "previous" || control === "next") {
    return { "data-testid": CONTROL_TEST_IDS[control] };
  }
  return {};
};
