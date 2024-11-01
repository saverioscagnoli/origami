package fs

import (
	"fmt"
	"os"
	"runtime"
	"strings"
	"syscall"
	"time"
	"unsafe"

	"github.com/shirou/gopsutil/v4/disk"
	wails "github.com/wailsapp/wails/v2/pkg/runtime"
)

type Disk struct {
	Name        string  `json:"name"`
	Mountpoint  string  `json:"mountpoint"`
	Type        string  `json:"type"`
	Free        uint64  `json:"free"`
	Total       uint64  `json:"total"`
	Removable   bool    `json:"removable"`
	UsedPercent float64 `json:"usedPercent"`
}

func isRemovable(mountpoint string, name string) bool {
	if runtime.GOOS == "windows" {
		kernel32 := syscall.NewLazyDLL("kernel32.dll")
		getDriveType := kernel32.NewProc("GetDriveTypeW")

		// GetDriveTypeW returns 0 if it fails
		ptr, _ := syscall.UTF16PtrFromString(mountpoint)
		driveType, _, _ := getDriveType.Call(uintptr(unsafe.Pointer(ptr)))

		return driveType == 2
	} else {
		deviceName := strings.TrimPrefix(name, "/dev/")
		removablePath := fmt.Sprintf("/sys/block/%s/removable", deviceName)

		data, err := os.ReadFile(removablePath)
		if err != nil {
			return false
		}

		return strings.TrimSpace(string(data)) == "1"
	}
}

func (fs *Filesystem) FetchDisks() []Disk {
	disks := []Disk{}
	parts, _ := disk.Partitions(false)

	for _, part := range parts {
		usage, err := disk.Usage(part.Mountpoint)

		if err != nil {
			continue
		}

		disk := Disk{
			Name:        part.Device,
			Mountpoint:  part.Mountpoint,
			Type:        part.Fstype,
			Free:        usage.Free,
			Total:       usage.Total,
			Removable:   isRemovable(part.Mountpoint, part.Device),
			UsedPercent: usage.UsedPercent,
		}

		disks = append(disks, disk)
	}

	return disks
}

// Fetch the disks every second
// So that if there are changes in the disks
// or their usage, we can update the UI
func (f *Filesystem) StartFetchDisksInterval() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	go func() {
		for range ticker.C {
			wails.EventsEmit(f.ctx, "disks", f.FetchDisks())
		}

	}()

	// Keep the goroutine running indefinitely
	<-make(chan struct{})
}
