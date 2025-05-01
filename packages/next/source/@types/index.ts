import type { Revalidate } from "next/dist/server/lib/revalidate";
import type { IncrementalCacheKind } from "next/dist/server/response-cache/types";

export interface FileCacheValueContext {
  kind: IncrementalCacheKind;
  revalidate?: Revalidate;
  fetchUrl?: string;
  fetchIdx?: number;
  tags?: string[];
  softTags?: string[];
  isRoutePPREnabled?: boolean;
  isFallback: boolean | undefined;
}
