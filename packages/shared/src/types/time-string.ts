// String following the ISO 8601 date string format, same as the one used by Date.toISOString()
export type TimeString =
  `${number}-${number}-${number}T${number}:${number}:${number}${'' | 'Z' | `+${number}:${number}` | `-${number}:${number}`}`;
