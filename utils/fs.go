package utils

import (
	"runtime"
)

// Returns the separator for the current OS
func GetSeparator() string {
	if runtime.GOOS == "windows" {
		return "\\"
	}
	return "/"
}
