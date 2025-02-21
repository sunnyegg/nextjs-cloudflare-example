interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

const cacheMap = new Map<string, CacheItem<unknown>>();

// Set the cache item with a TTL (time-to-live) value
// If the TTL value is not provided, the default TTL is 60 seconds
function set<T>(key: string, value: T, ttl: number = 60000): void {
  cacheMap.set(key, {
    value,
    timestamp: Date.now(),
    ttl,
  });
}

// Get the cache item with the given key
function get<T>(key: string): T | null {
  const item = cacheMap.get(key);

  if (!item) {
    return null;
  }

  // Check if item has expired
  if (Date.now() - item.timestamp > item.ttl) {
    cacheMap.delete(key);
    return null;
  }

  return item.value as T;
}

// Remove the cache item with the given key
function remove(key: string): void {
  cacheMap.delete(key);
}

// Clear the entire cache
function clear(): void {
  cacheMap.clear();
}

export const cache = {
  set,
  get,
  delete: remove,
  clear,
};
