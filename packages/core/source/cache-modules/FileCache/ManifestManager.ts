import path from "node:path";
import type { NodeFs } from "../../@types/fs";

interface IManifestManagerFile {
  version: number;
  items: {
    [key: string]: {
      revalidatedAt: number;
    };
  };
}

interface IManifestManagerProps {
  fs: NodeFs;
  baseTags?: string[];
  dir: string;
}

export class ManifestManager {
  private static fileName = "tags-manifest.json";
  private value?: IManifestManagerFile;
  private baseTags: string[] = [];
  private fs: NodeFs;
  private dir: string;

  constructor(options: IManifestManagerProps) {
    this.dir = options.dir;
    this.fs = options.fs;

    if (options.baseTags?.length) this.baseTags.push(...options.baseTags);
  }

  get filePath() {
    return path.join(this.dir, ManifestManager.fileName);
  }

  isLoaded(): boolean {
    return !!this.value;
  }

  async updateRevalidatedAt(tags: string[]) {
    for (const tag of tags) {
      const data = this.value?.items[tag] || {
        revalidatedAt: Date.now(),
      };

      data.revalidatedAt = Date.now();

      if (this.value) {
        this.value.items[tag] = data;
      }
    }

    await this.write();
  }

  private async write() {
    try {
      await this.fs.mkdir(path.dirname(this.dir));

      await this.fs.writeFile(this.filePath, JSON.stringify(this?.value || {}));
    } catch (err) {}
  }

  /**
   * Load the tags manifest from the file system
   */
  async load() {
    try {
      this.value = JSON.parse(await this.fs.readFile(this.filePath, "utf8"));
    } catch (err) {
      this.value = { version: 1, items: {} };
    }
  }

  /**
   * Check if tag is expired
   */
  expired(tag: string, lastModified: number) {
    const now = Date.now();

    return (
      this.baseTags.includes(tag) ||
      (this.value?.items[tag]?.revalidatedAt &&
        this.value?.items[tag].revalidatedAt >= lastModified)
    );
  }
}
