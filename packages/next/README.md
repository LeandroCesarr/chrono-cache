# 📦 **@chrono-cache/next**

A custom cache handler for Next.js, designed to address a common challenge: the need for large and costly distributed cache solutions (e.g., Redis) in horizontally scaled applications hosted outside of Vercel. This package uses `@chrono-cache/core` to manage an in-memory cache with TTL support. After the defined time, the in-memory cache is automatically refreshed locally, removing the need for distributed synchronization. Why does this matter?

- Reduces operational costs by eliminating the dependency on external distributed cache infrastructure.
- Makes efficient caching accessible in scalable environments with independent instances.

## 🚀 Installation

To install the package, use npm or pnpm:

```bash
pnpm add @chrono-cache/next
```

## Usage

Registering the Cache Handler
To enable @chrono-cache/next, you need to register the cache handler in your Next.js configuration file (`next.config.js`):


```ts
import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheHandler: path.resolve("node_modules/@chrono-cache/next/dist/index.js"),
};

export default nextConfig;
```

## 📘 Documentation

### Configuration

Using environment variables you can change the default system settings

- `CACHE_MEMORY_LIMIT`: Sets the memory cache size limit (in bytes).
Example: `CACHE_MEMORY_LIMIT=1048576` (1 MB)

- `CACHE_MEMORY_LIFETIME`: Sets the lifetime of the memory cache (in milliseconds).
Example: `CACHE_MEMORY_LIFETIME=60000` (60 seconds)

- `NEXT_PRIVATE_DEBUG_CACHE`: Enables debug logs to help monitor cache behavior.
Example: `NEXT_PRIVATE_DEBUG_CACHE=true`

Example: Using Environment Variables
Create a `.env.local` file in your Next.js project and add the desired configuration:

```
CACHE_MEMORY_LIMIT=1048576
CACHE_MEMORY_LIFETIME=60000
NEXT_PRIVATE_DEBUG_CACHE=true
```

## 🤝 Contributions

Contributions are welcome! If you find a bug or have an idea to improve the project, feel free to open an [issue](https://github.com/LeandroCesarr/chrono-cache/issues) or submit a pull request.

<a href="https://www.buymeacoffee.com/Astronaut4" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>


## ⚖️ License
[MIT © Leandro C. Silva](./../../LICENSE)
