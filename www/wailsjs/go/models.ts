export namespace fs {
	
	export class DirEntry {
	    name: string;
	    path: string;
	    isDir: boolean;
	    isHidden: boolean;
	    isSymlink: boolean;
	    lastMod: string;
	    size: number;
	
	    static createFrom(source: any = {}) {
	        return new DirEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.isDir = source["isDir"];
	        this.isHidden = source["isHidden"];
	        this.isSymlink = source["isSymlink"];
	        this.lastMod = source["lastMod"];
	        this.size = source["size"];
	    }
	}
	export class Disk {
	    name: string;
	    mountpoint: string;
	    type: string;
	    free: number;
	    total: number;
	    removable: boolean;
	    usedPercent: number;
	
	    static createFrom(source: any = {}) {
	        return new Disk(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.mountpoint = source["mountpoint"];
	        this.type = source["type"];
	        this.free = source["free"];
	        this.total = source["total"];
	        this.removable = source["removable"];
	        this.usedPercent = source["usedPercent"];
	    }
	}

}

