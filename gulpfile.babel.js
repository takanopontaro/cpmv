// unset limitation of event listener
require('events').EventEmitter.defaultMaxListeners = Infinity;

import * as util from './assets/gulp/util';
import gulp from 'gulp';
import createWatch from './assets/gulp/watch';
import * as clean from './assets/gulp/task/clean';
import * as webpack from './assets/gulp/task/webpack';

const tasks = [webpack];

export const build = gulp.series(clean.task, ...tasks.map(t => t.task));
export const watch = createWatch('watch', tasks);

export default gulp.series(build, watch);
