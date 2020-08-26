import _ from 'lodash';

export default class JSONDataNormalizer<Entry> {
    constructor(private entries: Entry[]) {}

    public update<T>(key: string, value: T) {
        const paths = this.parsePath(key);
        console.log(paths);
        this.entries.forEach((entry, index) => {
            this.updateEntry(entry, paths, value);
            this.entries.splice(index, 1, entry);
        });
    }

    private set(json: any, path: string | null, value: any, next: NextFunc): any {
        const [nextPath, nextFunc] = next();
        if (_.isNull(path)) {
            return (json as any[]).map((json: any) => this.set(json, nextPath, value, nextFunc));
        } else if (nextPath || _.isNull(nextPath)) {
            _.set(
                json,
                path,
                _.get(json, path).map((json: any) => this.set(json, nextPath, value, nextFunc)),
            );
        } else {
            return _.set(json, path, value);
        }
    }

    private updateEntry<T>(entry: any, paths: (string | null)[], value: T) {
        while (paths.length) {
            const next: NextFunc = () => [paths.splice(0, 1)[0], next];
            this.set(entry, paths.splice(0, 1)[0], value, next);
        }
    }

    private parsePath(inputPath?: string, acc: (string | null)[] = []): (string | null)[] {
        if (!inputPath) {
            return acc;
        }
        const match = /^([\w\.]+)?(\[?(.+)\])?$/.exec(inputPath);

        if (_.isNull(match)) {
            console.log(inputPath, match);
            throw new Error('Invalid entry.');
        }

        const [, path, , rest] = match;
        acc.push(path || null);
        return this.parsePath(rest, acc);
    }

    public data() {
        return this.entries;
    }
}

type NextFunc = () => [string | null, NextFunc];

const data: any = {
    foo: {
        bar: [
            {
                baz: [
                    {
                        jaz: false,
                    },
                ],
            },
            {
                baz: [
                    {
                        jaz: false,
                    },
                ],
            },
        ],
    },
};
