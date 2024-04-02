type Entry = {
  name: string;
  path: string;
  is_folder: boolean;
  is_hidden: boolean;
  is_symlink: boolean;
  is_starred: boolean;
  last_modified: string;
  size: string;
};

export type { Entry };
