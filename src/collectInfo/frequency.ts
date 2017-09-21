import { TimeSeries } from '../types';

const DAY = 24 * 3600 * 1000;
const MONTH = 30 * DAY;

const roundToDay = (time: number | string): number => new Date(time).setHours(0, 0, 0, 0);

export const getIssueFrequency = (
  issues: { state; created_at }[],
  length: number
): TimeSeries<{ all: number; open: number }> => {
  const maxTime = roundToDay(Date.now());
  const map = new Map<number, { all: number; open: number }>(
    Array.from({ length })
      .map((_, i) => [ maxTime - i * DAY, { all: 0, open: 0 } ] as [number, { all: number; open: number }])
      .reverse()
  );
  issues.forEach(({ state, created_at }) => {
    const time = roundToDay(created_at);
    if (!map.has(time)) return;
    const isOpen = state === 'open';
    const current = map.get(time);
    current.all += 1;
    if (isOpen) current.open += 1;
  });
  return [ ...map.entries() ].map(([ time, value ]) => ({ time, value }));
};
