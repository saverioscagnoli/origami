export namespace config {
	
	export class Config {
	    theme: string;
	    showHidden: boolean;
	    showCheckboxes: boolean;
	    view: string;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.theme = source["theme"];
	        this.showHidden = source["showHidden"];
	        this.showCheckboxes = source["showCheckboxes"];
	        this.view = source["view"];
	    }
	}

}

export namespace fs {
	
	export class DirEntry {
	    Name: string;
	    IsDir: boolean;
	    Path: string;
	    IsSymlink: boolean;
	    IsHidden: boolean;
	    IsStarred: boolean;
	    LastModified: string;
	    Size: number;
	
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
	        this.LastModified = source["LastModified"];
	        this.Size = source["Size"];
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

