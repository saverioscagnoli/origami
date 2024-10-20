package fs

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/adrg/xdg"
	"github.com/fsnotify/fsnotify"
	"github.com/labstack/gommon/log"
	wails "github.com/wailsapp/wails/v2/pkg/runtime"
)

var StarredDir = filepath.Join(xdg.ConfigHome, "origami", "starred")
var Watcher *fsnotify.Watcher = nil
var CurrentPath = "C:"

func (f *Filesystem) StartDirWatcher() {
	if Watcher != nil {
		return
	}

	w, err := fsnotify.NewWatcher()
	Watcher = w

	Watcher.Add(CurrentPath)

	if err != nil {
		log.Fatal(err)
	}

	defer Watcher.Close()

	go func() {
		for {
			select {
			case event, ok := <-Watcher.Events:
				if !ok {
					return
				}

				fmt.Println("event:", event)

				if event.Has(fsnotify.Write) {
					wails.EventsEmit(f.ctx, "f:write", NewDirEntryFromPath(event.Name))
				}

				if event.Has(fsnotify.Create) {
					wails.EventsEmit(f.ctx, "f:create", NewDirEntryFromPath(event.Name))
				}

				if event.Has(fsnotify.Remove) {
					wails.EventsEmit(f.ctx, "f:remove", event.Name)
				}

				if event.Has(fsnotify.Rename) {
					wails.EventsEmit(f.ctx, "f:rename")
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

func (f *Filesystem) FetchKnownFolders() map[string]string {
	// Check if starred dir exists
	// if not, create it
	if _, err := os.Stat(StarredDir); os.IsNotExist(err) {
		os.MkdirAll(StarredDir, 0755)
	}

	return map[string]string{
		"starred":   StarredDir,
		"home":      filepath.Join(xdg.UserDirs.Desktop, "../"),
		"desktop":   xdg.UserDirs.Desktop,
		"downloads": xdg.UserDirs.Download,
		"documents": xdg.UserDirs.Documents,
		"pictures":  xdg.UserDirs.Pictures,
	}
}
