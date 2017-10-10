import parallel from './runParallel';

parallel(
  Array.from({ length: 10 }).map((_, i) => () =>
    new Promise(resolve => {
      setTimeout(() => {
        console.log(`${i} is done`);
        resolve(i);
      }, Math.random() * 2000);
    })
  ),
  3
).then(results => console.log(results));
