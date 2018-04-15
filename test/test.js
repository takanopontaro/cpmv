const assert = require('chai').assert;
const del = require('del');
const fs = require('fs');
const makeDir = require('make-dir');
const path = require('path');
const cpmv = require('..');

process.chdir(__dirname);

beforeEach(async () => {
  await del('files');
  await makeDir('files/lang/js/_');
  fs.writeFileSync('files/lang/js/file', '');
  await makeDir('files/lang/js/lib');
  fs.writeFileSync('files/lang/js/lib/jquery.js', '');
  fs.writeFileSync('files/lang/js/lib/react.js', '');
  await makeDir('files/lang/ruby');
  fs.writeFileSync('files/lang/ruby/rails.rb', '');
  fs.writeFileSync('files/lang/ruby/sinatra.rb', '');
  await makeDir('files/os');
  fs.writeFileSync('files/os/mac.txt', '');
  fs.writeFileSync('files/os/windows.txt', '');
  fs.writeFileSync('files/os/linux.txt', '');
});

describe('File as File', () => {
  it('to a different directory', async () => {
    const [map] = await cpmv.createSrcDestMap(
      'files/lang/js/lib/jquery.js',
      'files/os/jquery.js',
      'as'
    );
    assert.equal(map.src, path.resolve('files/lang/js/lib/jquery.js'));
    assert.equal(map.dest, path.resolve('files/os/jquery.js'));
  });

  it('to an another directory', async () => {
    const [map] = await cpmv.createSrcDestMap(
      'files/os/mac.txt',
      '../../apple.txt',
      'as'
    );
    assert.equal(map.src, path.resolve('files/os/mac.txt'));
    assert.equal(map.dest, path.resolve('../../apple.txt'));
  });

  it('to a same directory', async () => {
    const [map] = await cpmv.createSrcDestMap(
      'files/lang/js/lib/jquery.js',
      'files/lang/js/jquery2.js',
      'as'
    );
    assert.equal(map.src, path.resolve('files/lang/js/lib/jquery.js'));
    assert.equal(map.dest, path.resolve('files/lang/js/jquery2.js'));
  });
});

describe('File to Directory', () => {
  it('to a different directory', async () => {
    const [map] = await cpmv.createSrcDestMap(
      'files/lang/js/lib/jquery.js',
      'files/os',
      'to'
    );
    assert.equal(map.src, path.resolve('files/lang/js/lib/jquery.js'));
    assert.equal(map.dest, path.resolve('files/os/jquery.js'));
  });

  it('to a weird directory', async () => {
    const [map] = await cpmv.createSrcDestMap(
      'files/lang/js/lib/jquery.js',
      'files/os/jquery.js',
      'to'
    );
    assert.equal(map.src, path.resolve('files/lang/js/lib/jquery.js'));
    assert.equal(map.dest, path.resolve('files/os/jquery.js/jquery.js'));
  });
});

describe('Directory as Directory', () => {
  it('to a different directory', async () => {
    const map = await cpmv.createSrcDestMap('files/lang/js', 'files/js2', 'as');
    assert.equal(map[0].src, path.resolve('files/lang/js/_/') + path.sep);
    assert.equal(map[0].dest, path.resolve('files/js2/_/') + path.sep);
    assert.equal(map[1].src, path.resolve('files/lang/js/file'));
    assert.equal(map[1].dest, path.resolve('files/js2/file'));
    assert.equal(map[2].src, path.resolve('files/lang/js/lib/jquery.js'));
    assert.equal(map[2].dest, path.resolve('files/js2/lib/jquery.js'));
    assert.equal(map[3].src, path.resolve('files/lang/js/lib/react.js'));
    assert.equal(map[3].dest, path.resolve('files/js2/lib/react.js'));
  });
});

describe('Directory to Directory', () => {
  it('to a different directory', async () => {
    const map = await cpmv.createSrcDestMap('files/lang/js', 'files/js2', 'to');
    assert.equal(map[0].src, path.resolve('files/lang/js/_/') + path.sep);
    assert.equal(map[0].dest, path.resolve('files/js2/js/_/') + path.sep);
    assert.equal(map[1].src, path.resolve('files/lang/js/file'));
    assert.equal(map[1].dest, path.resolve('files/js2/js/file'));
    assert.equal(map[2].src, path.resolve('files/lang/js/lib/jquery.js'));
    assert.equal(map[2].dest, path.resolve('files/js2/js/lib/jquery.js'));
    assert.equal(map[3].src, path.resolve('files/lang/js/lib/react.js'));
    assert.equal(map[3].dest, path.resolve('files/js2/js/lib/react.js'));
  });
});
