import type fs from "node:fs";

export interface NodeFs {
  existsSync: typeof fs.existsSync;
  readFile: typeof fs.promises.readFile;
  readFileSync: typeof fs.readFileSync;
  writeFile(f: string, d: string | Buffer): Promise<void>;
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  mkdir(dir: string): Promise<string | void>;
  stat(f: string): Promise<{ mtime: Date }>;
}
