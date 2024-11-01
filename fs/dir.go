package fs

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/adrg/xdg"
	"github.com/fsnotify/fsnotify"
	wails "github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	FSCreateEvent = "fs:create"
	FSDeleteEvent = "fs:delete"
	FSRenameEvent = "fs:rename"
)

var Watcher, _ = fsnotify.NewWatcher()
var CurrentDir = "C:"

func (f *Filesystem) StartWatcher() {
	defer Watcher.Close()

	go func() {
		for {
			select {
			case event, ok := <-Watcher.Events:
				if !ok {
					return
				}

				switch event.Op {
				// On create, create a new entry so it can be added to the list
				case fsnotify.Create:
					wails.EventsEmit(f.ctx, FSCreateEvent, NewEntry(event.Name))

				// On remove, just send the path so it can be deleted
				case fsnotify.Remove:
					wails.EventsEmit(f.ctx, FSDeleteEvent, event.Name)

				// On rename, send the old and new path
				// so the entry can be updated
				case fsnotify.Rename:
					wails.EventsEmit(f.ctx, FSRenameEvent)
				}

			case err, ok := <-Watcher.Errors:
				if !ok {
					return
				}

				fmt.Println("error:", err)
			}
		}
	}()

	<-make(chan struct{})
}

func updateWatcher(newPath string) {
	Watcher.Remove(CurrentDir)
	Watcher.Add(newPath)
	CurrentDir = newPath
}

func (fs *Filesystem) ListDir(path string) ([]DirEntry, error) {
	// Check if path ends with a slash
	// If not, add one, because it gives weird results otherwise
	if path[len(path)-1] != '/' {
		path += "/"
	}

	updateWatcher(path)

	dir, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	// Pre-allocation
	entries := make([]DirEntry, 0, len(dir))

	for _, entry := range dir {
		path := filepath.Join(path, entry.Name())

		isDir := entry.Type().IsDir()

		size := int64(0)
		info, err := entry.Info()

		if err != nil {
			continue
		}

		if !isDir {
			size = info.Size()
		}

		dirEntry := DirEntry{
			Name:      entry.Name(),
			Path:      path,
			IsDir:     isDir,
			IsHidden:  isPathHidden(path),
			IsSymlink: entry.Type()&os.ModeSymlink != 0,
			LastMod:   info.ModTime().Format("02/01/06 15:04"),
			Size:      size,
		}

		entries = append(entries, dirEntry)
	}

	return entries, nil
}

func (fs *Filesystem) FetchKnownFolders() []string {
	return []string{
		StarredDir,
		xdg.Home,
		xdg.UserDirs.Desktop,
		xdg.UserDirs.Download,
		xdg.UserDirs.Documents,
		xdg.UserDirs.Pictures,
		xdg.UserDirs.Music,
		xdg.UserDirs.Videos,
	}
}

func (fs *Filesystem) FetchConfigDir() string {
	return ConfigDir
}
