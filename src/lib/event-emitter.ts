class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  public on(event: string, cb: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(cb);
  }

  public emit<T>(event: string, ...args: T[]): void {
    if (!this.events[event]) {
      throw new Error(`No listeners registered for event: "${event}"`);
    }

    for (const cb of this.events[event]) {
      cb(...args);
    }
  }

  public removeListener(event: string, cb: Function): void {
    if (!this.events[event]) {
      throw new Error(`No listeners registered for event: "${event}"`);
    }

    this.events[event] = this.events[event].filter(fn => fn !== cb);
  }
}
export { EventEmitter };
