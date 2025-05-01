import {
  FileCache as CoreFileCache,
  type IFileCacheProps,
} from "@chrono-cache/core/source/cache-modules/FileCache";
import type {
  CacheHandler,
  CacheHandlerValue,
} from "next/dist/server/lib/incremental-cache";
import {
  type CachedFetchValue,
  CachedRouteKind,
  IncrementalCacheKind,
  type IncrementalCacheValue,
} from "next/dist/server/response-cache/types";
import type { FileCacheValueContext } from "../../@types";

interface IFileCacheOptions extends IFileCacheProps {}

export class FileCache implements CacheHandler {
  private fileHandler: CoreFileCache;

  constructor(options: IFileCacheOptions) {
    this.fileHandler = new CoreFileCache(options);
  }

  async get(
    key: string,
    { kind }: FileCacheValueContext,
  ): Promise<CacheHandlerValue | null> {
    if (kind === IncrementalCacheKind.FETCH) {
      return await this.getFetchCache(key);
    }

    return null;
  }

  private async getFetchCache(key: string): Promise<CacheHandlerValue | null> {
    const result = await this.fileHandler.get(key);

    if (!result) return null;

    const parsedValue = JSON.parse(result.value as string);

    return {
      value: parsedValue as CachedFetchValue,
      lastModified: result.lastModified,
    };
  }

  async set(
    key: string,
    data: IncrementalCacheValue | null,
    ctx: FileCacheValueContext,
  ): Promise<void> {
    if (data?.kind === CachedRouteKind.FETCH) {
      await this.setFetchCache(key, data, ctx);
    }
  }

  private async setFetchCache(
    key: string,
    data: IncrementalCacheValue | null,
    ctx: FileCacheValueContext,
  ): Promise<void> {
    await this.fileHandler.set(
      key,
      JSON.stringify({
        ...data,
        tags: ctx.tags,
      }),
      ctx.tags,
    );
  }

  async revalidateTag(tags: string[]): Promise<void> {
    await this.fileHandler.revalidateTags(tags);
  }

  resetRequestCache(): void {}
}
