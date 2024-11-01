package fs

import (
	"os"
	"path/filepath"
)

type DirEntry struct {
	Name      string `json:"name"`
	Path      string `json:"path"`
	IsDir     bool   `json:"isDir"`
	IsHidden  bool   `json:"isHidden"`
	IsSymlink bool   `json:"isSymlink"`
	LastMod   string `json:"lastMod"`
	Size      int64  `json:"size"`
}

func NewEntry(path string) DirEntry {
	info, err := os.Stat(path)
	if err != nil {
		return DirEntry{}
	}

	return DirEntry{
		Name:      filepath.Base(path),
		Path:      path,
		IsDir:     info.IsDir(),
		IsHidden:  isPathHidden(path),
		IsSymlink: info.Mode()&os.ModeSymlink != 0,
		LastMod:   info.ModTime().Format("02/01/06 15:04"),
		Size:      info.Size(),
	}
}

func (f *Filesystem) CreateEntry(path string, isDir bool) {
	if isDir {
		os.MkdirAll(path, 0755)
	} else {
		file, err := os.Create(path)

		if err != nil {
			return
		}

		file.Close()
	}
}

func (f *Filesystem) DeleteEntries(paths []string) {
	for _, path := range paths {
		err := os.RemoveAll(path)

		if err != nil {
			return
		}
	}
}
