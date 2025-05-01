import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FileCache } from '../source/modules/cache/FileCache';
import type { NodeFs } from '@chrono-cache/core/source/@types/fs';
import { fetchBodyExample } from './data/fetch';
import { IncrementalCacheKind } from 'next/dist/server/response-cache';

describe('[Next] File Cache: Fetch', () => {
  let instance: FileCache;

  const dir = path.resolve('tests');

  afterEach(() => {
    if (!fs.existsSync(dir)) return;

    fs.rmSync(dir, {
      recursive: true,
    });
  });

  beforeEach(() => {
    vi.useRealTimers();

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
      } as NodeFs,
    });
  });

  it('Should returns a valid cached value', async () => {
    // Arrange
    await instance.set('any-key', fetchBodyExample, {
      kind: IncrementalCacheKind.FETCH,
      isFallback: false,
    });

    // Act
    const result = await instance.get('any-key', {
      kind: IncrementalCacheKind.FETCH,
      isFallback: false,
    });

    // Assert
    expect(result).not.toBeNull();
  });

  it('Should not returns a valid cached value', async () => {
    // Act
    const result = await instance.get('any-key', {
      kind: IncrementalCacheKind.FETCH,
      isFallback: false,
    });

    // Arrange
    expect(result).toBeNull();
  });

  it('Should not returns a expired cached value', async () => {
    // Arrange
    await instance.set('any-key', fetchBodyExample, {
      kind: IncrementalCacheKind.FETCH,
      isFallback: false,
      tags: ['tag'],
    });

    await instance.revalidateTag(['tag']);

    // Act
    const result = await instance.get('any-key', {
      kind: IncrementalCacheKind.FETCH,
      isFallback: false,
      tags: ['tag'],
    });

    // Assert
    expect(result).toBeNull();
  });

  it('Should remove caches using tags', async () => {
    // Arrange
    const keys: string[] = Array.from({ length: 4 }).map((_, idx) =>
      idx.toString()
    );

    const prs = keys.map((key, idx) =>
      instance.set(key, fetchBodyExample, {
        kind: IncrementalCacheKind.FETCH,
        isFallback: false,
        tags: [idx % 2 === 0 ? '1' : '2'],
      })
    );

    await Promise.all(prs);

    // Act
    await instance.revalidateTag(['1']);

    // Assert

    for (let index = 0; index < keys.length; index++) {
      if (index % 2 === 0) {
        expect(
          await instance.get(keys[index] ?? '', {
            kind: IncrementalCacheKind.FETCH,
            isFallback: false,
            tags: [index % 2 === 0 ? '1' : '2'],
          })
        ).toBeNull();
      }

      if (index % 2 !== 0) {
        expect(
          await instance.get(keys[index] ?? '', {
            kind: IncrementalCacheKind.FETCH,
            isFallback: false,
            tags: [index % 2 === 0 ? '1' : '2'],
          })
        ).not.toBeNull();
      }
    }
  });
});
