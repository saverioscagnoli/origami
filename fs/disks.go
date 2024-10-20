package fs

import (
	"fmt"
	"time"

	"github.com/shirou/gopsutil/v4/disk"
	wails "github.com/wailsapp/wails/v2/pkg/runtime"
)

// Represents a disk in the system
type Disk struct {
	Name        string
	Mountpoint  string
	Filesystem  string
	Total       uint64
	Used        uint64
	Free        uint64
	UsedPercent float64
}

// Retrieves the disks in the system
// Builds information about each disk
func (f *Filesystem) FetchDisks() []Disk {
	disks := []Disk{}
	partitions, _ := disk.Partitions(false)

	for _, partition := range partitions {
		usageStat, err := disk.Usage(partition.Mountpoint)
		if err != nil {
			fmt.Printf("Error getting usage for %s: %v\n", partition.Mountpoint, err)
			continue
		}

		disks = append(disks, Disk{
			Name:        partition.Device,
			Mountpoint:  partition.Mountpoint,
			Filesystem:  partition.Fstype,
			Total:       usageStat.Total,
			Used:        usageStat.Used,
			Free:        usageStat.Free,
			UsedPercent: usageStat.UsedPercent,
		})
	}

	return disks
}

// Fetch the disks every second
// So that if there are changes in the disks
// or their usage, we can update the UI
func (f *Filesystem) StartFetchDisksInterval() {
	// Emit first before starting the ticker
	// This way we get the initial disk list
	wails.EventsEmit(f.ctx, "disks", f.FetchDisks())

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	go func() {
		for range ticker.C {
			wails.EventsEmit(f.ctx, "disks", f.FetchDisks())
		}

	}()

	// Keep the main goroutine running indefinitely
	select {}
}
