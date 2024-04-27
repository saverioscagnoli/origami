type DirEntry = {
  path: string;
  name: string;
  isDir: boolean;
  isHidden: boolean;
  isSymlink: boolean;
  isStarred: boolean;
  lastModified: string;
  size: number;
};

export type { DirEntry };