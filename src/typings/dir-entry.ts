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

/**
 * A restricted version of DirEntry that does not include the file size and last modified date.
 * Used in the workspace when searching everywhere.
 */
type RestrictedDirEntry = {
  path: string;
  name: string;
  isDir: boolean;
};

export type { DirEntry, RestrictedDirEntry };
