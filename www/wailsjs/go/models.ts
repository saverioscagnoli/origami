export namespace fs {
	
	export class DirEntry {
	    Name: string;
	    IsDir: boolean;
	    Path: string;
	    IsSymlink: boolean;
	    IsHidden: boolean;
	    IsStarred: boolean;
	
	    static createFrom(source: any = {}) {
	        return new DirEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.IsDir = source["IsDir"];
	        this.Path = source["Path"];
	        this.IsSymlink = source["IsSymlink"];
	        this.IsHidden = source["IsHidden"];
	        this.IsStarred = source["IsStarred"];
	    }
	}
	export class Disk {
	    Name: string;
	    Mountpoint: string;
	    Filesystem: string;
	    Total: number;
	    Used: number;
	    Free: number;
	    UsedPercent: number;
	
	    static createFrom(source: any = {}) {
	        return new Disk(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Mountpoint = source["Mountpoint"];
	        this.Filesystem = source["Filesystem"];
	        this.Total = source["Total"];
	        this.Used = source["Used"];
	        this.Free = source["Free"];
	        this.UsedPercent = source["UsedPercent"];
	    }
	}

}
