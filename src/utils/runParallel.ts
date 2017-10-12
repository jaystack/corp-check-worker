import flatten from './flatten';

export type Task<T> = () => Promise<T>;

const WAITING = Symbol();

const repeat = (num: number, func: Function) => {
  if (num <= 0) return;
  for (let i = 0; i < num; ++i) func(i);
};

const initResults = <T>(length: number): (T | Symbol)[] => Array.from({ length }).map(() => WAITING);

export default <T>(tasks: Task<T>[], limit: number = 1): Promise<T[]> => {
  return new Promise<T[]>((resolve, reject) => {
    if (tasks.length === 0) resolve([]);
    const remainedTasks: Task<T>[] = [ ...tasks ];
    const results: (T | Symbol)[] = initResults<T>(tasks.length);
    let runningTasks: number = 0;

    const next = () => {
      repeat(limit - runningTasks, () => {
        const task = remainedTasks.shift();
        const taskIndex = tasks.findIndex(t => t === task);
        if (!task) return;
        ++runningTasks;
        task()
          .then(result => {
            --runningTasks;
            results[taskIndex] = result;
            if (results.every(result => result !== WAITING)) return resolve(results as T[]);
            next();
          })
          .catch(error => reject(error));
      });
    };

    next();
  });
};
