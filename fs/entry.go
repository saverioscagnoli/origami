package fs

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"syscall"

	wails "github.com/wailsapp/wails/v2/pkg/runtime"
)

// DirEntry represents a file or directory in the filesystem
// It differs from the os.DirEntry
type DirEntry struct {
	Name         string
	IsDir        bool
	Path         string
	IsSymlink    bool
	IsHidden     bool
	IsStarred    bool
	LastModified string
	Size         int64
}

// Helper function for windows, checks if the file is hidden
// via syscall :(
func isPathHiddenWin(path string) bool {
	pointer, err := syscall.UTF16PtrFromString(path)

	if err != nil {
		return false
	}

	attributes, err := syscall.GetFileAttributes(pointer)

	if err != nil {
		return false
	}

	return attributes&syscall.FILE_ATTRIBUTE_HIDDEN != 0
}

// Helper function for unix, just checks if the name starts with a dot
func isPathHiddenUnix(name string) bool {
	return strings.HasPrefix(name, ".")
}

// Cross-platform function to check if a file is hidden
// or is it?
func IsPathHidden(path string, name string) bool {
	if runtime.GOOS == "windows" {
		return isPathHiddenWin(path)
	} else {
		return isPathHiddenUnix(name)
	}
}

// Checks if a path exists in the starred directory
// The starre directory is located in the App folder.
// Windows: AppData/Local/origami/starred
// Unix: $XDG_DATA_HOME/origami/starred
func IsPathStarred(path string) bool {
	name := filepath.Base(path)
	starredPath := filepath.Join(StarredDir, name)

	// Check if starredPath exists in the starred directory
	if _, err := os.Stat(starredPath); err == nil {
		return true
	}

	return false
}

// Crates a new DirEntry from a path.
// Useful for example when creating a new file / dir,
// Instead of reloading the whole directory, we can just
// create a new DirEntry and append it to the list.
func NewDirEntryFromPath(path string) DirEntry {
	info, err := os.Lstat(path)

	if err != nil {
		return DirEntry{}
	}

	name := info.Name()

	return DirEntry{
		Name:         name,
		IsDir:        info.IsDir(),
		Path:         path,
		IsSymlink:    info.Mode() == os.ModeSymlink,
		IsHidden:     IsPathHidden(path, name),
		IsStarred:    IsPathStarred(path),
		LastModified: info.ModTime().Format("02/01/06 15:04"),
		Size:         info.Size(),
	}
}

// Lists the contents of a directory
// Returns a list of DirEntry
func (f *Filesystem) ListDir(path string) ([]DirEntry, error) {

	// Change the current path to the new one
	// So that the watcher doesnt emit events for the old path
	Watcher.Remove(CurrentPath)
	CurrentPath = path
	Watcher.Add(path)

	// Check if path ends with a slash
	// If not, add one, because it gives weird results otherwise
	if path[len(path)-1] != '/' {
		path += "/"
	}

	entries := []DirEntry{}
	dir, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	var wg sync.WaitGroup
	results := make(chan DirEntry, len(dir))

	for _, entry := range dir {
		wg.Add(1)
		go func(entry os.DirEntry) {
			defer wg.Done()

			name := entry.Name()
			path := filepath.Join(path, name)
			info, _ := entry.Info()

			results <- DirEntry{
				Name:         entry.Name(),
				IsDir:        entry.IsDir(),
				Path:         path,
				IsSymlink:    entry.Type() == os.ModeSymlink,
				IsHidden:     IsPathHidden(path, name),
				IsStarred:    IsPathStarred(path),
				LastModified: info.ModTime().Format("02/01/2006 15:04"),
				Size:         info.Size(),
			}
		}(entry)
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	for result := range results {
		entries = append(entries, result)
	}

	return entries, nil
}

// Creates a new file or directory
// Bound to the frontend
func (f *Filesystem) CreateEntry(path string, isDir bool) {
	if isDir {
		os.MkdirAll(path, 0755)
	} else {
		file, err := os.Create(path)

		if err != nil {
			fmt.Println(err)
			return
		}

		defer file.Close()
	}
}

// Deletes a list of entries
// Bound to the frontend
func (f *Filesystem) DeleteEntries(paths []string) {
	for _, path := range paths {
		err := os.Remove(path)

		if err != nil {
			fmt.Println(err)
		}
	}
}

// Renames an entry
// Bound to the frontend
func (f *Filesystem) RenameEntry(oldPath string, newName string) {
	newPath := filepath.Join(filepath.Dir(oldPath), newName)
	os.Rename(oldPath, newPath)
}

var runDll32 = filepath.Join(os.Getenv("SYSTEMROOT"), "System32", "rundll32.exe")

// Opens files with the default application
// on windows, it uses rundll32.exe
func (f *Filesystem) OpenFiles(paths []string) {
	for _, path := range paths {
		if runtime.GOOS == "windows" {
			cmd := exec.Command(runDll32, "url.dll,FileProtocolHandler", path)
			cmd.Start()
		} else if runtime.GOOS == "darwin" {
			cmd := exec.Command("open", path)
			cmd.Start()
		} else {
			cmd := exec.Command("xdg-open", path)
			cmd.Start()
		}
	}
}

// Stars a list of entries
// By starring an entry, we create a symlink in the starred directory
func (f *Filesystem) StarEntries(entries []DirEntry) {
	for _, entry := range entries {
		starredPath := filepath.Join(StarredDir, entry.Name)

		// Check if starredPath exists in the starred directory
		if _, err := os.Stat(starredPath); err == nil {
			continue
		}

		if runtime.GOOS == "windows" {
			// On windows, the symlink creation requires admin privileges
			// that sucks, we need to check if the app is running as admin
			// if not we use hard links for files and junctions for directories
			isElevated := false

			if isElevated {
				err := os.Symlink(entry.Path, starredPath)

				if err != nil {
					fmt.Println(err)
				}
			} else {
				if entry.IsDir {
					// Idk why but creating a junction with a syscall
					// requires admin privileges, so we use cmd
					cmd := exec.Command("cmd", "/c", "mklink", "/J", starredPath, entry.Path)
					cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
					cmd.Run()
				} else {
					err := os.Link(entry.Path, starredPath)

					if err != nil {
						fmt.Println(err)
					}
				}
			}

		} else {
			err := os.Symlink(entry.Path, starredPath)

			if err != nil {
				fmt.Println(err)
			}
		}

		wails.EventsEmit(f.ctx, "f:star", entry.Path)
	}
}

// Unstars a list of entries
// By unstarring an entry, we remove the symlink in the starred directory
func (f *Filesystem) UnstarEntries(paths []string) {
	for _, path := range paths {
		name := filepath.Base(path)
		starredPath := filepath.Join(StarredDir, name)

		// Check if starredPath exists in the starred directory
		if _, err := os.Stat(starredPath); err != nil {
			continue
		}

		// Remove the symlink in the starred directory
		err := os.Remove(starredPath)

		if err != nil {
			fmt.Println(err)
		}

		// Emit only if the path is not in the StarredDir
		// Because the normal delete event will be emitted
		if filepath.Dir(path) != StarredDir {
			wails.EventsEmit(f.ctx, "f:unstar", path)
		}
	}
}
