# 🚀 **chrono-cache**

## _The modular caching solution for modern applications._

## 📖 About

**chrono-cache** is a suite of caching tools designed to provide flexibility, simplicity, and performance. Our goal is to offer caching solutions that adapt to different contexts and frameworks, making cache management more efficient and practical.
Currently, the focus is on the **core**, which already includes robust functionality. Soon, new packages will complement the suite, expanding integration possibilities with popular frameworks.

---

## 📦 Available Packages

### **@chrono-cache/core**

The backbone of the suite, containing essential modules for efficient caching.

- **Currently supported modes**:
  - **LRU Cache**: An in-memory cache based on the Least Recently Used (LRU) algorithm. In addition to prioritizing the most accessed data, the chrono-cache LRU includes an extra feature: **Time-to-Live (TTL)**. This allows cache items to expire automatically after a defined period, giving you more control over data validity.
  - **File Cache**: A persistent, file-based cache designed to securely store data on disk. Ideal for scenarios where cache needs to persist across restarts.
    Quick example:

```typescript
import fs from 'node:fs'
import { LRUCache, FileCache } from '@chrono-cache/core';

// In-memory LRU cache with TTL
const lru = new LRUCache({
  max: 100, // max size in Bytes
  ttl: 60000 // 1-minute TTL
});

lru.set('key', 'value');

setTimeout(() => {
  console.log(lru.get('key')); // null (expired after 1 minute)
}, 61000);

// File-based cache
const fileCache = new FileCache({
  fs,
  dir: './cache'
});

fileCache.set('fileKey', JSON.stringify({ data: 'stored in a file' }));

console.log(fileCache.get('fileKey')); // '{ data: 'stored in a file' }'
```

---

## 🛠 Upcoming Packages

We’re expanding **chrono-cache** to address framework-specific needs. Upcoming packages include:

### **@chrono-cache/next**

A custom cache handler for **Next.js**, designed to address a common challenge: the need for large and costly distributed cache solutions (e.g., Redis) in horizontally scaled applications hosted outside of **Vercel**.
This package uses **@chrono-cache/core** to manage an in-memory cache with TTL support. After the defined time, the in-memory cache is automatically refreshed locally, removing the need for distributed synchronization.
**Why does this matter?**

- Reduces operational costs by eliminating the dependency on external distributed cache infrastructure.
- Makes efficient caching accessible in scalable environments with independent instances.

### **@chrono-cache/remix-cache**

A solution for **Remix**, integrating seamlessly with the framework’s architecture to add caching to loaders, actions, and routes. This package focuses on simplifying data persistence and reuse in Remix applications.

## 🛠 Installation

To get started, install the core package:

```bash
npm install @chrono-cache/core
```

## The new packages will be available soon.

## 🌟 Key Benefits

1. **Modularity**: A core that can be used standalone or as a base for framework-integrated packages.
2. **Simplicity**: A clear, easy-to-use, and well-documented API.
3. **Performance**: Tools optimized for different use cases, ensuring efficiency.
4. **Cost-effectiveness**: Reduce complexity and cost by eliminating the need for external caching solutions in certain situations.

---

## 🤝 Contributions

Contributions are welcome! If you find a bug or have an idea to improve the project, feel free to open an [issue](https://github.com/LeandroCesarr/chrono-cache/issues) or submit a pull request.

## ⚖️ License
This project is licensed under the MIT License.
