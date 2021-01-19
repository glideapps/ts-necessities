export interface ReadonlyDefaultMap<K, V> extends ReadonlyMap<K, V> {
    get(k: K): V;
}

export class DefaultMap<K, V> extends Map<K, V> implements ReadonlyDefaultMap<K, V> {
    constructor(private readonly _defaultFunc: (k: K) => V, initKVPs?: readonly (readonly [K, V])[]) {
        super(initKVPs);
    }

    public get(k: K): V {
        let v = super.get(k);
        if (v === undefined) {
            v = this._defaultFunc(k);
            this.set(k, v);
        }
        return v;
    }

    public update(k: K, f: (v: V) => V): V {
        const v = f(this.get(k));
        this.set(k, v);
        return v;
    }
}
