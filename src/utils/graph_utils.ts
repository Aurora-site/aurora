export function colorFormat<T extends object>(value: T, key: keyof T): string {
  const val = value[key];

  if (typeof val !== "number") {
    throw new Error("Value must be a number");
  }

  if (val > 6) {
    return "#E90D0D";
  } else if (val > 4) {
    return "#FA8917";
  } else if (val > 2) {
    return "#DBDB01";
  } else {
    return "#00972D";
  }
}
