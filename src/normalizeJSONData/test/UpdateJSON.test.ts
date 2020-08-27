import UpdateJSON from '../UpdateJSON';
import data from './data/data.json';

test('nothing', async () => {
    const json = new UpdateJSON(data);
    const out = json.update('foo.bar', 3).update('foo.bar', number => [...Array(number).keys()]).data();
    console.log(JSON.stringify(out));
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
