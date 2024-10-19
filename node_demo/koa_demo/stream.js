import { createReadStream,createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

// // 打开流:
// let rs = createReadStream('sample.txt', 'utf-8');

// // 读取到数据:
// rs.on('data', (chunk) => {
//     console.log('---- chunk ----');
//     console.log(chunk);
// });

// // 结束读取:
// rs.on('end', () => {
//     console.log('---- end ----');
// });

// // 出错:
// rs.on('error', err => {
//     console.log(err);
// });


// let ws = createWriteStream('output.txt', 'utf-8');
// ws.write('使用Stream写入文本数据...\n');
// ws.write('继续写入...\n');
// ws.write('DONE.\n');
// ws.end(); // 结束写入

async function copy(src, dest) {
    let rs = createReadStream(src);
    let ws = createWriteStream(dest);
    await pipeline(rs, ws);
}

copy('sample.txt', 'output.txt')
    .then(() => console.log('copied.'))
    .catch(err => console.log(err));

