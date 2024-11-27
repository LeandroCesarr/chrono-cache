import fs from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FileCache } from '../source/cache-modules/FileCache';
import type { NodeFs } from '../source/@types/fs';
import path from 'node:path';

describe('File Cache', () => {
  let instance: FileCache;

  const dir = path.resolve("tests");

  afterEach(() => {
    if (!fs.existsSync(dir)) return;

    fs.rmSync(dir, {
      recursive: true
    });
  })

  beforeEach(() => {
    vi.useRealTimers()

    vi.spyOn(console, 'log').mockImplementation(() => {});

    instance = new FileCache({
      dir,
      debug: true,
      fs: {
        existsSync: fs.existsSync,
        readFile: fs.promises.readFile,
        readFileSync: fs.readFileSync,
        writeFile: (f, d) => fs.promises.writeFile(f, d),
        mkdir: (dir) => fs.promises.mkdir(dir, { recursive: true }),
        stat: (f) => fs.promises.stat(f),
      } as NodeFs
    })
  })

  it('Should returns a valid cached value', async () => {
    // Arrange
    await instance.set('any-key', "Lorem")

    console.log(fs.readFileSync(path.resolve(dir, "any-key")))

    // Act
    const result = await instance.get('any-key');

    // Assert
    expect(result).not.toBeNull()
  })

  it('Should not returns a valid cached value', async () => {
    // Arrange
    expect(await instance.get('any-key')).toBeNull()
  })

  it('Should not returns a expired cached value', async () => {
    // Arrange
    await instance.set('any-key', "Lorem", ["tag"])

    await instance.revalidateTags(["tag"])

    // Act
    const result = await instance.get('any-key');

    // Assert
    expect(result).toBeNull()
  })

  it('Should remove caches using tags', async () => {
    // Arrange
    const keys: string[] = Array.from({ length: 4 }).map((_, idx) => idx.toString())

    const prs = keys.map((key, idx) => instance.set(key, key, [idx % 2 === 0 ? "1" : "2"]))

    await Promise.all(prs);

    // Act
    await instance.revalidateTags(["1"]);

    // Assert

    for (let index = 0; index < keys.length; index++) {
      if (index % 2 === 0) {
        expect(await instance.get(keys[index] ?? "")).toBeNull();
      }

      if (index % 2 !== 0) {
        expect(await instance.get(keys[index] ?? "")).not.toBeNull();
      }
    }
  })
})