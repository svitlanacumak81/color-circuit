export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

// Monospaced-feel star string, e.g. "14 / 30".
export function starLine(earned: number, total: number): string {
  return `${earned} / ${total}`;
}
