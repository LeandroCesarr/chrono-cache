import path from "node:path";
import { LRUCache } from "@chrono-cache/core/source/cache-modules/LRUCache";
import type {
  CacheHandler,
  CacheHandlerContext,
  CacheHandlerValue,
} from "next/dist/server/lib/incremental-cache";
import type { IncrementalCacheValue } from "next/dist/server/response-cache/types";
import type { FileCacheValueContext } from "../@types";
import { FileCache } from "./cache/FileCache";
import { serializeCacheValue } from "../utils";

const EXCLUDED_KEYS = ["favicon.ico"];

let memoryCache: LRUCache<IncrementalCacheValue>;

export class CustomCacheHandler implements CacheHandler {
  private flushToDisk = false;
  private memoryCache: LRUCache<IncrementalCacheValue>;
  private fileCache?: FileCache;

  constructor(options: CacheHandlerContext) {
    const debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE

    this.flushToDisk = !!options.flushToDisk;

    memoryCache ??= new LRUCache({
      debug,
      maxSize: Number.parseInt(process.env.CACHE_MEMORY_LIMIT ?? "0", 10),
      ttl: Number.parseInt(process.env.CACHE_MEMORY_LIFETIME ?? "0", 10),
      serializeValue: serializeCacheValue,
    });

    if (options.fs && options.serverDistDir) {
      this.fileCache = new FileCache({
        debug,
        fs: options.fs,
        dir: path.join(options.serverDistDir, "..", "cache", "fetch-cache"),
      });
    }

    this.memoryCache = memoryCache;
  }

  async revalidateTag(args: string[]): Promise<void> {
    const tags = CustomCacheHandler.normalizeTags(args);

    if (!tags.length) return;

    await this.fileCache?.revalidateTag(tags);

    this.memoryCache.revalidateTags(tags);
  }

  async get(
    key: string,
    ctx: FileCacheValueContext,
  ): Promise<CacheHandlerValue | null> {
    if (EXCLUDED_KEYS.some((excludedKey) => key.includes(excludedKey)))
      return null;

    const memoryValue = this.memoryCache.get(key);

    if (memoryValue) return memoryValue;

    if (process.env.NEXT_RUNTIME === "edge" || !this.flushToDisk) return null;

    const localValue = await this.fileCache?.get(key, ctx);

    if (localValue?.value) {
      this.memoryCache.set(key, localValue.value);

      return localValue;
    }

    return null;
  }

  async set(
    key: string,
    data: IncrementalCacheValue | null,
    ctx: FileCacheValueContext,
  ): Promise<void> {
    if (!data) return;

    this.memoryCache.set(key, data);

    if (this.flushToDisk && this.fileCache)
      await this.fileCache.set(key, data, ctx);
  }

  resetRequestCache(): void {}

  static normalizeTags(args: string | string[]): string[] {
    const [tags] = args;

    if (typeof tags === "string") return [tags];

    if (Array.isArray(tags)) return tags;

    return [];
  }
}
