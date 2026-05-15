const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

export function getRelativeTimeString(date: Date | number, now: number = Date.now()): string {
  const timeMs = typeof date === "number" ? date : date.getTime();
  const deltaSeconds = Math.round((now - timeMs) / 1000);
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];
  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ];
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));
  const divider = unitIndex ? cutoffs[unitIndex - 1] : 1;
  
  if (Math.abs(deltaSeconds) < 60) {
    return "Just now";
  }
  
  return rtf.format(-Math.floor(deltaSeconds / divider), units[unitIndex]);
}
