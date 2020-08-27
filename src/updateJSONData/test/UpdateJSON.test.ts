import UpdateJSON from '../../';
import blank from './data/blank.json';
import blankSchema from './data/blank.schema.json';
import data from './data/data.json';
import dataSchema from './data/data.schema.json';

test('Fill up blank objects and return them', () => {
    const json = new UpdateJSON(blank, blankSchema);
    json.update('foo.bar', 3).update('foo.bar', (number) => [...Array(number).keys()]);
    expect(json.validate()).toBeTruthy();
    expect(json.data()).toBeDefined();
    expect(json.data()).not.toBeNull();
});

test('Array of arrays', () => {
    const json = new UpdateJSON(data, dataSchema);
    json.update('foo.bar[[baz[qux]]]', null);
    expect(json.validate()).toBeTruthy();
});

test('Invalid array mutation', () => {
    const json = new UpdateJSON(blank, blankSchema);
    expect(() => json.update('foo[bar]', true)).toThrowError('Invalid entry or path.');
});

test('Valid array mutation', () => {
    const json = new UpdateJSON(blank, blankSchema);
    expect(() => json.update('foo', [{ bar: null }]).update('foo[bar]', true)).not.toThrowError('Invalid entry.');
});

test('Invalid path', () => {
    const json = new UpdateJSON(blank, blankSchema);
    expect(() => json.update('foo~!', true)).toThrowError('Invalid entry or path.');
});

test('Invalid result', () => {
    const json = new UpdateJSON(blank, blankSchema);
    expect(() => json.validate()).toThrowError(/^Invalid entry .+/);
});

test('Undefined schema', () => {
    const json = new UpdateJSON(blank);
    expect(() => json.validate()).toThrowError('Schema not defined.');
});
