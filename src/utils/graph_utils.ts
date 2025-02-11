export function colorFormat<T extends object>(value: T, key: keyof T): string {
  const val = value[key];

  if (typeof val !== "number") {
    throw new Error("Value must be a number");
  }

  if (val > 5) {
    return "#E90D0D";
  } else if (val > 3) {
    return "#DBDB01";
  } else {
    return "#00972D";
  }
}
