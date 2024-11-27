import type fs from 'node:fs'

export interface NodeFs {
  existsSync: typeof fs.existsSync
  readFile: typeof fs.promises.readFile
  readFileSync: typeof fs.readFileSync
  writeFile(f: string, d: string | Buffer): Promise<void>
  mkdir(dir: string): Promise<string | undefined>
  stat(f: string): Promise<{ mtime: Date }>
}