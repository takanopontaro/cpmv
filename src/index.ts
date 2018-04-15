import cpFile from 'cp-file';
import del from 'del';
import fg, { Options as FgOptions } from 'fast-glob';
import fs from 'fs';
import moveFile from 'move-file';
import path from 'path';
import pify from 'pify';

export type SrcDestMap = { [src: string]: string };

export type Progress = {
  path: string;
  total: number;
  completed: number;
  failed: number;
};

export type Callback = (progress: Progress) => void;

export type Options = {
  method: 'as' | 'to';
  callback?: Callback;
};

const pstat = pify(fs.stat);

const defaultOptions: Options = {
  method: 'to'
};

const fgOptions: FgOptions<string> = {
  deep: true,
  dot: true,
  onlyFiles: false,
  markDirectories: true,
  followSymlinkedDirectories: false,
  nobrace: true,
  brace: false,
  noext: true,
  extension: false
};

async function normalizePaths(src: string) {
  const paths = await fg.async<string>('**', { ...fgOptions, cwd: src });
  return paths.filter((rel, i) => {
    if (!rel.endsWith('/') || paths[i + 1].indexOf(rel) === -1) {
      return true;
    }
    return false;
  });
}

async function createSrcDestMap(
  src: string,
  dest: string,
  method: Options['method']
): Promise<SrcDestMap[]> {
  try {
    const srcBase = path.basename(src);
    const absSrc = path.resolve(src);
    const absDest = path.resolve(dest);
    const srcStats: fs.Stats = await pstat(src);
    const isFile = srcStats.isFile();
    const isDir = srcStats.isDirectory();
    // const isLink = srcStats.isSymbolicLink();

    if (isFile && method === 'as') {
      return [{ src: absSrc, dest: absDest }];
    }

    if (isFile && method === 'to') {
      return [{ src: absSrc, dest: path.join(absDest, srcBase) }];
    }

    if (isDir && method === 'as') {
      const paths = await normalizePaths(src);
      return paths.map(rel => ({
        src: path.join(absSrc, rel),
        dest: path.join(absDest, rel)
      }));
    }

    if (isDir && method === 'to') {
      const paths = await normalizePaths(src);
      return paths.map(rel => ({
        src: path.join(absSrc, rel),
        dest: path.join(absDest, srcBase, rel)
      }));
    }

    throw new Error('EFILETYPE');
  } catch (e) {
    throw e;
  }
}

function createPromise(type: string, src: string, dest: string) {
  switch (type) {
    case 'copy':
      return cpFile(src, dest);
    case 'move':
      return moveFile(src, dest);
    default:
      throw new Error();
  }
}

async function handleFiles(
  type: 'copy' | 'move',
  src: string,
  dest: string,
  options?: Partial<Options>
) {
  const { method, callback } = { ...defaultOptions, ...options };
  try {
    const srcDestMaps = await createSrcDestMap(src, dest, method);
    const total = srcDestMaps.length;
    let completed = 0;
    let failed = 0;

    await Promise.all(
      srcDestMaps.map(map =>
        (async () => {
          try {
            await createPromise(type, map.src, map.dest);
            completed += 1;
          } catch (e) {
            failed += 1;
          }
          callback && callback({ path: map.src, total, completed, failed });
        })()
      )
    );
  } catch (e) {
    throw e;
  }
}

async function copy(src: string, dest: string, options?: Partial<Options>) {
  await handleFiles('copy', src, dest, options);
}

async function move(src: string, dest: string, options?: Partial<Options>) {
  await handleFiles('move', src, dest, options);
  del(src, { force: true });
}

export { createSrcDestMap };
export { copy };
export { move };

exports.createSrcDestMap = createSrcDestMap;
exports.copy = copy;
exports.move = move;
