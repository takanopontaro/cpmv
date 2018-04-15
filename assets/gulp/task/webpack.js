import * as util from '../util';
import { spawn } from 'child_process';

process.env.FORCE_COLOR = true;

function stdio(proc) {
  proc.stdout.on('data', data => console.log(`${data}`));
  proc.stderr.on('data', data => console.error(`${data}`));
}

export const watched = () => {
  // const proc = spawn('webpack-dev-server');
  const proc = spawn('webpack', ['-w']);
  stdio(proc);
};

export const task = function webpack(done) {
  const proc = spawn('webpack');
  stdio(proc);
  proc.on('close', done);
};
