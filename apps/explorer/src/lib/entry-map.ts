class EntryMap<K, V> extends Map<K, V> {
  public constructor(map?: Iterable<readonly [K, V]>) {
    super(map)
  }

  public getPaths(): K[] {
    return Array.from(this.keys());
  }

  public getEntries(): V[] {
    return Array.from(this.values());
  }

  public getKeyValues(): [K, V][] {
    return Array.from(this.entries());
  }
}

export { EntryMap };
