import {ipcMain} from "electron"
import path from 'path'
import fs from 'fs'
import ExcelJS from "exceljs";

const titleStyle = {
    font: {
        name: '宋体', size: 12, bold: true,
    }, alignment: {
        vertical: 'middle', horizontal: 'center', wrapText: false,
    }, border: {
        top: {
            style: "thin",
        }, bottom: {
            style: "thin",
        }, left: {
            style: "thin",
        }, right: {
            style: "thin",
        },
    },
}
const dataStyle = {
    font: {
        name: '宋体', size: 10, bold: false,
    }, alignment: {
        vertical: 'middle', horizontal: 'center', wrapText: false,
    }, border: {
        top: {
            style: "thin",
        }, bottom: {
            style: "thin",
        }, left: {
            style: "thin",
        }, right: {
            style: "thin",
        },
    },
}
const leftDataStyle = {
    font: {
        name: '宋体', size: 10, bold: false,
    }, alignment: {
        vertical: 'middle', horizontal: 'left', wrapText: false,
    }, border: {
        top: {
            style: "thin",
        }, bottom: {
            style: "thin",
        }, left: {
            style: "thin",
        }, right: {
            style: "thin",
        },
    },
}

/**
 * 写文件
 * @param filePath
 * @param filename
 * @param list
 * @param list
 * @returns {Promise<Workbook>}
 */
const exportFile = async (filePath, filename, columns, list) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('数据');
    sheet.addRow(columns);

    let headers = [];
    columns.forEach(column => {
        headers.push({header: column, key: column, width: 30})
    })
    sheet.columns = headers;
    list.forEach((row, index) => {
        let rows = [];
        columns.forEach(column => {
            rows.push(row[column]);
        })
        sheet.addRow(rows, dataStyle);
    })
    sheet.getCell(1, 1).style = titleStyle;
    sheet.getCell(1, 2).style = titleStyle;
    sheet.getCell(1, 3).style = titleStyle;
    sheet.getCell(1, 4).style = titleStyle;
    sheet.getCell(1, 5).style = titleStyle;
    sheet.getCell(1, 6).style = titleStyle;
    sheet.getCell(1, 7).style = titleStyle;
    sheet.views = [
        {state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'H1', activeCell: 'A1'}
    ];
    return await workbook.xlsx.writeFile(path.join(filePath, filename));
}

ipcMain.handle('export.excel', (event, filePath, filename, columns, list) => {
    return exportFile(filePath, filename, columns, list);
})

const exportText = (filepath, filename, text) => {
    let file = path.join(filepath, filename);
    return new Promise((resolve, reject) => {
        fs.writeFile(file, text, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}


ipcMain.handle('export.text', (event, filePath, filename, text) => {
    return exportText(filePath, filename, text);
})