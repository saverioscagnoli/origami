type DirEntry = {
  name: string;
  isDir: boolean;
  isHidden: boolean;
  isSymlink: boolean;
  isStarred: boolean;
  size: number;
};

export type { DirEntry };
