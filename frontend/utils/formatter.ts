export const formatCurrency = (
  value: number,
  currency = "INR",
  locale = "en-IN"
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

export const formatNumber = (value: number, locale = "en-IN") =>
  new Intl.NumberFormat(locale).format(value);

export const formatDate = (
  value: string | Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
) => new Intl.DateTimeFormat("en-IN", options).format(new Date(value));

export const formatDateTime = (value: string | Date) =>
  formatDate(value, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export const formatPercent = (value: number, fractionDigits = 1) =>
  new Intl.NumberFormat("en-IN", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
