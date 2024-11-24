import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LRUCache } from '../source/cache-modules/LRUCache';

const sleep = async (ms: number) => await new Promise(resolve => setTimeout(resolve, ms))

describe('LRU Cache', () => {
  let instance: LRUCache<string>;

  beforeEach(() => {
    vi.useRealTimers()

    vi.spyOn(console, 'log').mockImplementation(() => {});

    instance = new LRUCache({
      maxSize: 10,
      serializeValue: (value) => value,
      debug: true,
      ttl: 2_000
    })
  })

  it('Should returns a valid cached value', () => {
    // Arrange
    instance.set('any-key', "Lorem")

    // Act
    const result = instance.has('any-key');

    // Assert
    expect(result).toBeTruthy()
  })

  it('Should not returns a valid cached value', () => {
    // Arrange
    expect(instance.has('any-key')).toBeFalsy()
  })

  it('Should not store value if exceeds max size', () => {
    // Arrange

    // Act
    instance.set('any-key', 'loreeeeeeeeeeeeeeeeeeem');

    // Assert
    expect(instance.has('any-key')).toBeFalsy();
  })

  it('Should not returns a expired cached value', async () => {
    // Arrange
    instance.set('any-key', "Lorem")

    await sleep(3_000);

    // Act
    const result = instance.get('any-key');

    // Assert
    expect(result).toBeNull()
  })

  it('Should cache value with full memory, excluding the last one in the list', () => {
    // Arrange
    const keys: string[] = Array.from({ length: 10 }).map((_, idx) => idx.toString())

    keys.forEach(key => instance.set(key, key))

    // Act

    instance.set('new-key', "l");

    // Assert
    expect(instance.has('new-key')).toBeTruthy();

    keys.forEach((key, idx) => {
      if (idx === 0) {
        expect(instance.has(key)).toBeFalsy();
      }

      if (idx !== 0) {
        expect(instance.has(key)).toBeTruthy();
      }
    })
  })

  it('Should cache the value with full memory, excluding the last one in the list that has not been accessed recently', () => {
    // Arrange
    const keys: string[] = Array.from({ length: 10 }).map((_, idx) => idx.toString())

    keys.forEach(key => instance.set(key, key))

    instance.get(keys[0] ?? "");

    // Act

    instance.set('new-key', "l");

    // Assert
    expect(instance.has('new-key')).toBeTruthy();

    keys.forEach((key, idx) => {
      if (idx === 1) {
        expect(instance.has(key)).toBeFalsy();
      }

      if (idx !== 1) {
        expect(instance.has(key)).toBeTruthy();
      }
    })
  })

  it('Should remove caches using tags', () => {
    // Arrange
    const keys: string[] = Array.from({ length: 4 }).map((_, idx) => idx.toString())

    keys.forEach((key, idx) => instance.set(key, key, [idx % 2 === 0 ? "1" : "2"]))

    // Act
    instance.revalidateTags(["1"]);

    // Assert
    keys.forEach((key, idx) => {
      if (idx % 2 === 0) {
        expect(instance.has(key)).toBeFalsy();
      }

      if (idx % 2 !== 0) {
        expect(instance.has(key)).toBeTruthy();
      }
    })
  })
})