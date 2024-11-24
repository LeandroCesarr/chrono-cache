import { consoleColors } from "../utils/console";


type TLRUCalculateSize<T> = (value: T) => string;

type TCachedValue<TValue> = {
  value: TValue,
  tags: string[],
  lastModified: number,
  expiresAt: number
}

interface ILRUCacheProps<TValue> {
  /**
   * Max size of value in Bytes
   */
  maxSize: number;
  /**
   * Enable logs
   */
  debug?: boolean;
  /**
   * TTL in milliseconds
   */
  ttl: number;
  /**
   * Function to serialize value
   */
  serializeValue: TLRUCalculateSize<TValue>
}

export class LRUCache<TValue> {
  private memoryCache = new Map<string, TCachedValue<TValue>>();
  private cacheSizes = new Map<string, number>();
  private serializeValue: TLRUCalculateSize<TValue>;
  private debug = false;
  private totalSize = 0;
  private ttl = 60_000;
  private maxSize = 0;

  constructor(options: ILRUCacheProps<TValue>) {
    this.maxSize = options.maxSize;
    this.debug = options.debug ?? false;
    this.serializeValue = options.serializeValue;

    if (options.ttl) {
      this.ttl = options.ttl;
    }
  }

  /**
   * Get memory cache value
   */
  get(key: string) {
    const memoryValue = this.memoryCache.get(key);

    if (!memoryValue || memoryValue.expiresAt <= Date.now()) {
      if (this.debug)
        console.log(
          consoleColors.background.green('[CACHE:MEMORY]'),
          consoleColors.text.yellow('[SKIP]')
        )

      return null;
    }

    if (this.debug) {
      console.log(
        consoleColors.background.green('[CACHE:MEMORY]'),
        consoleColors.text.green('[HIT]')
      )
    }

    this.touch(key);

    return memoryValue;
  }

  /**
   * Set memory value
   */
  set(key: string, value: TValue, tags: string[] = []) {
    const size = this.calculateSize(value);

    if (size > this.maxSize) {
      console.log(
        consoleColors.background.green('[CACHE:MEMORY]'),
        consoleColors.text.red('Single item size exceeds max size')
      )

      return;
    }

    if (this.has(key)) {
      this.totalSize -= this.cacheSizes.get(key) || 0;
    }

    this.cacheSizes.set(key, size);
    this.memoryCache.set(key, {
      value,
      tags,
      lastModified: Date.now(),
      expiresAt: Date.now() + this.ttl,
    });

    this.totalSize += size;

    this.touch(key);
  }

  public has(key: string) {
    if (!key) return false;

    this.touch(key);

    return Boolean(this.memoryCache.get(key));
  }

  private touch(key: string): void {
    const value = this.memoryCache.get(key);

    if (value) {
      this.memoryCache.delete(key);
      this.memoryCache.set(key, value);
      this.evictIfNecessary();
    }
  }

  private evictIfNecessary() {
    while (this.totalSize > this.maxSize && this.memoryCache.size > 0) {
      this.evictLeastRecentlyUsed();
    }
  }

  private evictLeastRecentlyUsed() {
    const lruKey = this.getOldestCacheKey();

    if (lruKey !== undefined) {
      const lruSize = this.cacheSizes.get(lruKey) || 0;

      this.totalSize -= lruSize;
      this.memoryCache.delete(lruKey);
      this.cacheSizes.delete(lruKey);
    }
  }

  private getOldestCacheKey() {
    return this.memoryCache.keys().next().value;
  }

  private calculateSize(value: TValue) {
    return Buffer.byteLength(this.serializeValue(value), 'utf8');
  }

  /**
   * Revalidate using tags array
   */
  revalidateTags(tags: string[]) {
    this.memoryCache.forEach((value, key) => {
      if (tags.some((tag) => value.tags?.includes(tag))) {
        this.memoryCache.delete(key);
      }
    });
  }
}
