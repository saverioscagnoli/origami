package fs

import (
	"context"
	"os"
	"path/filepath"
	"runtime"
	"syscall"

	"github.com/adrg/xdg"
)

var ConfigDir = filepath.Join(xdg.ConfigHome, "origami")
var StarredDir = filepath.Join(ConfigDir, "starred")

type Filesystem struct {
	ctx context.Context
}

func New() *Filesystem {
	return &Filesystem{}
}

func (fs *Filesystem) Init(ctx context.Context) {
	fs.ctx = ctx

	// Create config directory if it doesn't exist
	if _, err := os.Open(ConfigDir); os.IsNotExist(err) {
		os.MkdirAll(ConfigDir, 0755)
	}

	// Create the starred directory if it doesn't exist
	if _, err := os.Open(StarredDir); os.IsNotExist(err) {
		os.MkdirAll(StarredDir, 0755)
	}
}

func isPathHidden(path string) bool {
	if runtime.GOOS == "windows" {
		pointer, err := syscall.UTF16PtrFromString(path)
		if err != nil {
			return false
		}

		attrs, err := syscall.GetFileAttributes(pointer)
		if err != nil {
			return false
		}

		return attrs&syscall.FILE_ATTRIBUTE_HIDDEN != 0
	} else {
		return filepath.Base(path)[0] == '.'
	}
}
