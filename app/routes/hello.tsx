import {json} from 'remix';

export async function loader() {
    return json({
        a: 1
    });
}