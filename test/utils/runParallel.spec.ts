import runParallel from '../../src/utils/runParallel';

describe('runParalell', () => {
  it('returns empty array if there is no tasks', async () => {
    expect(await runParallel([])).toEqual([]);
  });

  it('keeps the original order', async () => {
    const results = [ 10, 20, 30, 40, 50 ];
    const tasks = results.map(result => () =>
      new Promise(resolve => setTimeout(() => resolve(result), Math.random() * 100))
    );
    expect(await runParallel(tasks)).toEqual(results);
  });

  it('runs tasks one by one if limit is 1', async () => {
    const schedules = [ 20, 10, 30, 50, 40 ];
    const order = [ 0, 1, 2, 3, 4 ];
    const incomings = [];
    const tasks = schedules.map((schedule, i) => () =>
      new Promise(resolve => setTimeout(() => resolve(incomings.push(i)), schedule))
    );
    await runParallel(tasks);
    expect(incomings).toEqual(order);
  });

  it('runs all tasks parallel if limit is big enough', async () => {
    const schedules = [ 20, 10, 30, 50, 40 ];
    const order = [ 1, 0, 2, 4, 3 ];
    const incomings = [];
    const tasks = schedules.map((schedule, i) => () =>
      new Promise(resolve => setTimeout(() => resolve(incomings.push(i)), schedule))
    );
    await runParallel(tasks, schedules.length);
    expect(incomings).toEqual(order);
  });

  it('throws error if any task throws', async () => {
    const error = new Error('mock');
    const tasks = [ () => Promise.resolve(), () => Promise.reject(error), () => Promise.resolve() ];
    try {
      await runParallel(tasks);
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});
