export namespace config {
	
	export class Filter {
	    kind: string;
	    asc: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Filter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.kind = source["kind"];
	        this.asc = source["asc"];
	    }
	}
	export class Config {
	    theme: string;
	    showHidden: boolean;
	    showCheckboxes: boolean;
	    view: string;
	    filter: Filter;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.theme = source["theme"];
	        this.showHidden = source["showHidden"];
	        this.showCheckboxes = source["showCheckboxes"];
	        this.view = source["view"];
	        this.filter = this.convertValues(source["filter"], Filter);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
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

