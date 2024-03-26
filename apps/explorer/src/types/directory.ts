type DirEntry = {
  name: string;
  path: string;
  is_folder: boolean;
  is_hidden: boolean;
  last_modified: string;
  size: string;
  can_be_opened: boolean;
};

export type { DirEntry };
