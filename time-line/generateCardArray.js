const fs = require('fs');
const path = require('path');

// 读取文件夹并解析文件名
function parseFolder(folderPath) {
    const files = fs.readdirSync(folderPath);
    const result = [];

    files.forEach(file => {
        const [description, year] = path.basename(file, path.extname(file)).split('_');
        result.push({
            description,
            year: parseInt(year, 10)
        });
    });

    return result;
}

// 示例使用
const folderPath = path.join(__dirname, 'images', 'front');
const parsedData = parseFolder(folderPath);
console.log(parsedData);