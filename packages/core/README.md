# 📦 **@chrono-cache/core**

## 📖 About

**@chrono-cache/core** is the backbone of **chrono-cache**, designed to provide a flexible and efficient approach to cache management. It includes two types of cache that can be used in various scenarios:

- **LRU Cache** with TTL (Time-to-Live) support: An in-memory cache that prioritizes frequently accessed data and allows items to expire automatically after a configurable period.

- **File Cache**: A persistent, file-based cache, ideal for securely and efficiently storing data on disk.

This package serves as the foundation for future integrations with frameworks but can also be used independently in any project requiring a fast and reliable caching system.

---

## 🚀 Installation

To install the package, use npm or pnpm:

```bash
pnpm add @chrono-cache/core
```

## 📘 Documentation

### LRU Cache
The LRU Cache (Least Recently Used) keeps the most frequently accessed data in memory and automatically evicts the least used items when the capacity limit is reached. With TTL support, you can define a maximum lifetime for cache items.

```typescript
import { LRUCache } from '@chrono-cache/core';

// Creating an LRU cache with a limit of 100 Bytes and a TTL of 60 seconds
const cache = new LRUCache({
  maxSize: 100,
  ttl: 60_000
});

cache.set('key', 'value');

console.log(cache.get('key')); // 'value'

// After 60 seconds
setTimeout(() => {
    console.log(cache.get('key')); // null (expired)
}, 61_000);
```

## File Cache

The File Cache allows you to store persistent data on disk, making it ideal for scenarios where cache needs to survive system or application restarts.

```typescript
import fs from 'node:fs'
import { FileCache } from '@chrono-cache/core';

// Creating a file-based cache
const fileCache = new FileCache({
  fs,
  dir: './cache'
});

fileCache.set('fileKey', JSON.stringify({ data: 'This data is stored in a file' }));

console.log(fileCache.get('fileKey')); // '{ data: 'This data is stored in a file' }'
```

## 🤝 Contributions

Contributions are welcome! If you find a bug or have an idea to improve the project, feel free to open an [issue](https://github.com/LeandroCesarr/chrono-cache/issues) or submit a pull request.

<a href="https://www.buymeacoffee.com/Astronaut4" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>


## ⚖️ License
This project is licensed under the MIT License.
