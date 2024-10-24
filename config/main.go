package config

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/adrg/xdg"
)

var ConfigDir = filepath.Join(xdg.ConfigHome, "origami")
var ConfigPath = filepath.Join(ConfigDir, "config.json")

type Filter struct {
	Kind string `json:"kind"` // name, size, date
	Asc  bool   `json:"asc"`  // ascending or descending
}

type Config struct {
	ctx            context.Context
	Theme          string `json:"theme"`
	ShowHidden     bool   `json:"showHidden"`
	ShowCheckboxes bool   `json:"showCheckboxes"`
	View           string `json:"view"`
	Filter         Filter `json:"filter"`
}

func New() *Config {
	// Create and load the config
	c := &Config{}
	c.Load()

	return c
}

func (c *Config) SetContext(ctx context.Context) {
	c.ctx = ctx
}

func (c *Config) SetTheme(value string) {
	c.Theme = value
	c.Save()
}

func (c *Config) SetShowHidden(value bool) {
	c.ShowHidden = value
	c.Save()
}

func (c *Config) SetShowCheckboxes(value bool) {
	c.ShowCheckboxes = value
	c.Save()
}

func (c *Config) SetView(value string) {
	c.View = value
	c.Save()
}

func (c *Config) SetFilter(filter Filter) {
	c.Filter = filter
	c.Save()
}

func (c *Config) Load() error {
	// Create the config file if it doesn't exist
	if _, err := os.Stat(ConfigPath); os.IsNotExist(err) {
		defaultConfig := &Config{
			Theme:          "light",
			ShowHidden:     false,
			ShowCheckboxes: false,
			View:           "list",
			Filter: Filter{
				Kind: "name",
				Asc:  true,
			},
		}

		defaultConfig.Save()
	}

	file, err := os.Open(ConfigPath)

	if err != nil {
		return err
	}

	defer file.Close()

	decoder := json.NewDecoder(file)
	if err := decoder.Decode(c); err != nil {
		return err
	}

	return nil
}

func (c *Config) Save() error {
	file, err := os.Create(ConfigPath)
	if err != nil {
		return err
	}

	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")

	if err := encoder.Encode(c); err != nil {
		return err
	}

	return nil
}

func (c *Config) GetConfig() *Config {
	return c
}

func (c *Config) GetConfigDir() string {
	return ConfigDir
}

func (c *Config) LoadCustomCSS() []string {
	var sources []string
	paths := GetCssFilesInConfig()

	for _, path := range paths {
		sources = append(sources, LoadCssString(filepath.Join(ConfigDir, path)))
	}

	return sources
}
