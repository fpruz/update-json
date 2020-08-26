import JSONDataNormalizer from '../JSONDataNormalizer';
import data from './blankData.json';

test('nothing', async () => {
    const json = new JSONDataNormalizer(data);
    json.update('foo.bar[[baz.0.jaz]]', true);
    console.log(JSON.stringify(json.data()));
    // console.log(await json.data());

    // expect(json.data()).toEqual(
    //     expect.arrayContaining([
    //         expect.objectContaining({
    //             foo: {
    //                 bar: {},
    //             },
    //         }),
    //     ]),
    // );
});
