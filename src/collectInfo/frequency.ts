import { TimeSeries } from '../types';

const DAY = 24 * 3600 * 1000;
const MONTH = 30 * DAY;

const roundToDay = (time: number | string): number => new Date(time).setHours(0, 0, 0, 0);

export const getIssueFrequency = (
  issues: { state; created_at; closed_at }[]
): TimeSeries<{ all: number; open: number }> => {
  const minTime = roundToDay(
    issues.reduce((min, { created_at }) => (created_at ? Math.min(Date.parse(created_at), min) : min), Infinity)
  );
  const maxTime = roundToDay(Date.now());

  console.log(new Date(minTime));

  const length = Math.ceil((maxTime - minTime) / DAY) + 1;
  const initialFrequency = Array.from({ length }).map((_, i) => ({
    time: minTime + i * DAY,
    value: { all: 0, open: 0 }
  }));

  return issues.reduce((frequency, { created_at, closed_at, state }, i) => {
    if (!created_at) return frequency;
    const openAt = roundToDay(created_at);
    const closeAt = closed_at ? roundToDay(closed_at) : maxTime;
    return frequency.map(
      point =>
        point.time < openAt
          ? point
          : {
              time: point.time,
              value: { all: point.value.all + 1, open: point.time > closeAt ? point.value.open : point.value.open + 1 }
            }
    );
  }, initialFrequency);
};
