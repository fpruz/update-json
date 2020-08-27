import _ from 'lodash';
import { validator, ValidateFunc } from '@exodus/schemasafe';

export default class UpdateJSON<Entry> {
    private validateWithSchema: ValidateFunc | null = null;

    constructor(private entries: Entry[], schema?: any) {
        if (schema) {
            this.validateWithSchema = validator(schema);
        }
    }

    public update<T>(key: string, value: ((arg: any) => T) | T) {
        const paths = this.parsePath(key);
        this.entries.forEach((entry, index) => {
            const [nextPath, nextIterator] = new PathIterator(paths).next();
            this.set(entry, nextPath, value, nextIterator);
            this.entries.splice(index, 1, entry);
        });
        return this;
    }

    private set<T extends { [key: string]: any }, V>(
        json: T | T[],
        path: string | null,
        value: V | ((arg: any) => V),
        PathIter: PathIterator,
    ): any {
        const [nextPath, nextIterator] = PathIter.next();

        if (_.isNull(path)) {
            return (json as any[]).map((json: any) => this.set(json, nextPath, value, nextIterator.clone()));
        } else if (nextPath || _.isNull(nextPath)) {
            const get = _.get(json, path);
            if (_.isUndefined(get) || !_.isArray(get)) {
                throw new Error('Invalid entry or path.');
            }
            _.set(
                json,
                path,
                get.map((json: any) => this.set(json, nextPath, value, nextIterator.clone())),
            );
        } else {
            value = _.isFunction(value) ? value(_.get(json, path, value)) : value;
            return _.set(json, path, value);
        }
    }

    private parsePath(inputPath?: string, acc: (string | null)[] = []): (string | null)[] {
        if (!inputPath) {
            return acc;
        }
        const match = /^([\w\.]+)?(\[?(.+)\])?$/.exec(inputPath);

        if (_.isNull(match)) {
            throw new Error('Invalid entry or path.');
        }

        const [, path, , rest] = match;
        acc.push(path || null);
        return this.parsePath(rest, acc);
    }
    public data() {
        return this.entries;
    }
    public validate() {
        if (!this.validateWithSchema) {
            throw new Error('Schema not defined.');
        }

        for (const entry of this.entries) {
            if (!this.validateWithSchema(entry)) {
                throw new Error(`Invalid entry ${JSON.stringify(entry)}`);
            }
        }
        return this;
    }
}

class PathIterator {
    constructor(private paths: (string | null)[]) {
        this.paths = [...paths];
    }

    public next(): [string | null, PathIterator] {
        return [this.paths.splice(0, 1)[0], this];
    }
    public clone(): PathIterator {
        return new PathIterator([...this.paths]);
    }
}
