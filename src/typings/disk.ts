type Disk = {
  name: string;
  mountPoint: string;
  fileSystem: string;
  totalSpace: number;
  freeSpace: number;
  isRemovable: boolean;
};

export type { Disk };
