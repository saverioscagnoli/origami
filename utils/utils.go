package utils

import (
	"context"
	"runtime"
)

type Utils struct {
	ctx context.Context
}

func New() *Utils {
	return &Utils{}
}

func (u *Utils) Init(ctx context.Context) {
	u.ctx = ctx
}

// Sep returns the path separator for the current OS
func (u *Utils) Sep() string {
	if runtime.GOOS == "windows" {
		return "\\"
	} else {
		return "/"
	}
}
