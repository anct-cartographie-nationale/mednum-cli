export class InvalidHoursRangeError extends Error {
  constructor(public readonly hourRanges: (string | undefined)[]) {
    super(`The hour ranges '${hourRanges.join(',')}' cannot be read as a time`);
  }
}
