package fs

import (
	"context"
	"origami/utils"
)

type Filesystem struct {
	ctx context.Context
}

func New() *Filesystem {
	return &Filesystem{}
}

// Should only be used in the main.go file
func (f *Filesystem) SetContext(ctx context.Context) {
	f.ctx = ctx
}

// Returns the separator for the current OS
// Windows: \
// Unix: /
func (f *Filesystem) Sep() string {
	return utils.GetSeparator()
}
