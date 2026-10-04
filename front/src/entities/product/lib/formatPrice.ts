const formatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
});

/** Цена приходит с бека в копейках. */
export const formatPrice = (kopecks: number) => formatter.format(kopecks / 100);
