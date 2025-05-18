export interface Photo {
  id: string;
  name: string;
  path: string;
  url: string;
  selected: boolean;
  size: number;
  width: number;
  height: number;
  lastModified: number;
}

export interface Directory {
  name: string;
  handle: FileSystemDirectoryHandle | null;
}
