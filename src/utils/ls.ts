class LS {
  private ins = compatLS();

  public get<K extends string = string>(k: K): string {
    return this.ins.getItem(k) as string;
  }

  public set<K extends string = string>(k: K, v: string): boolean {
    this.ins.setItem(k, v);
    return true;
  }

  public remove<K extends string = string>(k: K): boolean {
    this.ins.removeItem(k);
    return true;
  }

  public clear(): boolean {
    this.ins.clear();
    return true;
  }
}

function compatLS() {
  return window.localStorage;
}

export const ls = new LS();
