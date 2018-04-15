// Type definitions for cp-file 4.2
// Project: https://github.com/sindresorhus/cp-file#readme
// Definitions by: BendingBender <https://github.com/BendingBender>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export = moveFile;

declare function moveFile(
  source: string,
  destination: string,
  options?: moveFile.Options
): Promise<void>;

declare namespace moveFile {
  function sync(source: string, destination: string, options?: Options): void;

  interface Options {
    overwrite?: boolean;
  }
}
