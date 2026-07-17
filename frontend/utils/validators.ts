export const isEmail = (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);

export const isPhone = (value: string) => /^\+?[1-9]\d{9,14}$/.test(value);

export const isStrongEnoughPassword = (value: string) => value.length >= 8;

export const isPositiveNumber = (value: number) => Number.isFinite(value) && value > 0;

export const isNonNegativeNumber = (value: number) => Number.isFinite(value) && value >= 0;

export const required = (value: unknown) => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== null && value !== undefined;
};
