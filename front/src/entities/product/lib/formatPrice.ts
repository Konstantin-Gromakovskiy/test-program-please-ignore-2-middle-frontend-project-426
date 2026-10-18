const formatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  // Целые рубли без «,00»: цифры в тексте цены совпадают со значением в фильтре
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Цена приходит с бека в копейках. */
export const formatPrice = (kopecks: number) => formatter.format(kopecks / 100);
