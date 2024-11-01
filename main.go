package main

import (
	"context"
	"embed"
	"origami/fs"
	"origami/utils"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:www/dist
var assets embed.FS

func main() {
	fs := fs.New()
	utils := utils.New()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "origami",
		Width:  1024,
		Height: 768,

		// Start hidden and then show the window
		// in the frontend, to avoid the blank window while loading
		StartHidden: true,

		Frameless:       true,
		CSSDragProperty: "widows",
		CSSDragValue:    "1",

		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: func(ctx context.Context) {
			fs.Init(ctx)
			utils.Init(ctx)

			go fs.StartWatcher()
			go fs.StartFetchDisksInterval()
		},
		Bind: []interface{}{
			fs, utils,
		},
		Debug: options.Debug{
			OpenInspectorOnStartup: true,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
