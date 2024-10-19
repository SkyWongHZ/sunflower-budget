// import { readFile ,readFileSync,stat} from 'node:fs';
import { readFile } from 'node:fs/promises';

console.log('BEGIN1');

// readFile('sample.txt', 'utf-8', function (err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// });

async function readTextFile(path) {
    return await readFile(path, 'utf-8');
}
readTextFile('./sample.txt').then(s=>console.log(s))



// readFile('sample.png', function (err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(data instanceof Buffer); // true
//         console.log( data); // Buffer(12451) [137, 80, 78, 71, 13, ...]
//     }
// });


// try {
//     let s = readFileSync('sample.txt', 'utf-8');
//     console.log(s);
// } catch (err) {
//     console.log(err);
// }


// stat('sample.png', function (err, st) {
//     console.log('st: ', st);
//     if (err) {
//         console.log(err);
//     } else {
//         // 是否是文件:
//         console.log('isFile: ' + st.isFile());
//         // 是否是目录:
//         console.log('isDirectory: ' + st.isDirectory());
//         if (st.isFile()) {
//             // 文件大小:
//             console.log('size: ' + st.size);
//             // 创建时间, Date对象:
//             console.log('birth time: ' + st.birthtime);
//             // 修改时间, Date对象:
//             console.log('modified time: ' + st.mtime);
//         }
//     }
// });

console.log('END');