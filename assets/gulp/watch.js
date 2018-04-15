import * as util from './util';
import gulp from 'gulp';

export default (name, tasks) => {
  const task = () =>
    tasks.forEach(({ watched, task }) => {
      if (typeof watched === 'function') {
        watched();
        return;
      }
      const changed = [];
      const cb = done => {
        const stream = task(done, [...changed]);
        changed.length = 0;
        return stream;
      };
      cb.displayName = task.displayName || task.name;
      gulp.watch(watched, cb).on('change', path => changed.push(path));
    });

  task.displayName = name;

  return task;
};
