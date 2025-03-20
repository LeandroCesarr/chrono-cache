import {
  CachedRouteKind,
  type IncrementalCacheValue,
} from "next/dist/server/response-cache/types";

export function serializeCacheValue(value: IncrementalCacheValue) {
  if (value.kind === CachedRouteKind.FETCH) {
    return JSON.stringify(value.data || "");
  }

  return "";
}
