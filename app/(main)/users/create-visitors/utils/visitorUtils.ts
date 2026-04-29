export const normalize = (value: string) =>
  value.trim().toLowerCase();

export const isEmpty = (value: unknown) =>
  String(value ?? "").trim() === "";

export const digitsOnly = (value: unknown) =>
  String(value ?? "").replace(/\D+/g, "");

export const isValidPhone = (value: unknown) =>
  /^\d{10}$/.test(String(value ?? "").trim());

export const isValidAge = (value: unknown) => {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) return false;

  const age = Number(text);
  return age >= 1 && age <= 120;
};