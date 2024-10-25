package utils

import (
	"context"
	"path/filepath"
	"runtime"
	"sync"
)

type Utils struct {
	ctx context.Context
}

func New() *Utils {
	return &Utils{}
}

// Should only be used in the main.go file
func (u *Utils) SetContext(ctx context.Context) {
	u.ctx = ctx
}

// Returns the separator for the current OS
// Windows: \
// Unix: /
func (u *Utils) Sep() string {
	if runtime.GOOS == "windows" {
		return "\\"
	} else {
		return "/"
	}
}

// Returns the name of the current OS
// Mainly "windows", "darwin" or "linux"
// For more values: https://go.dev/doc/install/source#environment
func (u *Utils) OsName() string {
	return runtime.GOOS
}

// Path.Join wrapper for frontend usage
func (u *Utils) JoinPath(paths []string) string {
	return filepath.Join(paths...)
}

func Parallelize(functions ...func()) {
	var wg sync.WaitGroup

	wg.Add(len(functions))

	defer wg.Wait()

	for _, fn := range functions {
		go func(f func()) {
			runtime.LockOSThread()
			defer wg.Done()
			f()
		}(fn)
	}
}
