package config

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/adrg/xdg"
)

var ConfigDir = filepath.Join(xdg.ConfigHome, "origami")

func GetCssFilesInConfig() []string {
	entries, err := os.ReadDir(ConfigDir)

	if err != nil {
		return []string{}
	}

	var cssFiles []string

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		if filepath.Ext(entry.Name()) == ".css" {
			cssFiles = append(cssFiles, entry.Name())
		}
	}

	return cssFiles
}

// Loads a css source into a string
func LoadCssString(path string) string {
	fmt.Println("Loading CSS from: ", path)
	// Read the file
	data, err := os.ReadFile(path)

	if err != nil {
		return ""
	}

	return string(data)
}
