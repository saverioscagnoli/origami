package main

import (
	"context"
	"embed"
	"origami/config"
	"origami/fs"
	"origami/utils"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:www/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	fs := fs.New()
	utils := utils.New()
	config := config.New()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "origami",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Frameless:       true,
		CSSDragProperty: "widows",
		CSSDragValue:    "1",
		OnStartup: func(ctx context.Context) {
			fs.SetContext(ctx)
			utils.SetContext(ctx)
			config.SetContext(ctx)

			go fs.StartFetchDisksInterval()
			go fs.StartDirWatcher()
		},
		EnableDefaultContextMenu: false,
		Bind: []interface{}{
			fs, utils, config,
		},
		Debug: options.Debug{
			OpenInspectorOnStartup: true,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
