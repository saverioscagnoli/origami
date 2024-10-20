package fs

import (
	"context"
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
