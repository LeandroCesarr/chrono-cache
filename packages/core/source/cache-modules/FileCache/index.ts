import path from 'node:path';
import type { NodeFs } from '../../@types/fs';
import { ManifestManager } from './ManifestManager';
import { consoleColors } from '../../utils/console';

type TCachedValue = {
  value: string | Buffer;
  tags: string[];
  lastModified: number;
};

interface IFileCacheProps {
  fs: NodeFs;
  dir: string;
  debug?: boolean;
}

export class FileCache {
  private distDir;
  private debug = false;
  private fs: NodeFs;
  private manifestManager: ManifestManager;

  constructor(options: IFileCacheProps) {
    this.fs = options.fs;
    this.debug = !!options.debug;
    this.distDir = options.dir;

    this.manifestManager = new ManifestManager({
      dir: options.dir,
      fs: options.fs,
      baseTags: [],
    });
  }

  /**
   * Get cached value
   */
  async get(key: string): Promise<TCachedValue | null> {
    try {
      const filePath = this.getFilePath([key]);
      const fileTagsPath = this.getFilePath(['tags', key]);

      const [fileData, fileTags] = await Promise.all([
        this.fs.readFile(filePath, 'utf8'),
        this.fs.readFile(fileTagsPath, 'utf8')
      ])

      const { mtime } = await this.fs.stat(filePath);
      const tags = JSON.parse(fileTags);

      if (!fileData || (await this.isExpired(tags, mtime.getTime()))) {
        throw new Error('Not found or expired');
      }

      if (this.debug)
        console.log(
          consoleColors.background.blue('[CACHE:SYSTEM]'),
          consoleColors.text.green('[HIT]')
        );

      return {
        lastModified: mtime.getTime(),
        value: fileData,
        tags,
      };
    } catch (error) {}

    if (this.debug)
      console.log(
        consoleColors.background.blue('[CACHE:SYSTEM]'),
        consoleColors.text.red('[SKIP]')
      );

    return await Promise.resolve(null);
  }

  /**
   * set cache
   */
  async set(
    key: string,
    data: TCachedValue['value'],
    tags: string[] = []
  ): Promise<void> {
    const filePath = this.getFilePath([key]);
    const fileTagsPath = this.getFilePath(['tags', key]);

    await Promise.all([
      this.fs.mkdir(path.dirname(filePath)),
      this.fs.mkdir(path.dirname(fileTagsPath)),
    ]);

    await Promise.all([
      await this.fs.writeFile(filePath, data),
      await this.fs.writeFile(fileTagsPath, JSON.stringify(tags)),
    ]);
  }

  /**
   * Revalidate cache using tags
   */
  async revalidateTags(tags: string[]): Promise<void> {
    await this.manifestManager.load();

    if (this.manifestManager.isLoaded()) {
      await this.manifestManager.updateRevalidatedAt(tags);
    }
  }

  private async isExpired(tags: string[], lastModified: number) {
    await this.manifestManager.load();

    const wasRevalidated = tags.some((tag) => {
      return this.manifestManager.expired(tag, lastModified);
    });

    return wasRevalidated;
  }

  private getFilePath(pathname: string[]): string {
    return path.join(this.distDir, ...pathname);
  }
}
