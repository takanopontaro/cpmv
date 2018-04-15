import * as util from '../util';
import del from 'del';

export const watched = ['dist'];

export const task = function clean() {
  return del(watched);
};
