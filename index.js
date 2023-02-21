console.log('starting ...')

fileName = process.argv[2]

console.log(process.argv)

console.log(fileName)

const readXlsxFile = require('read-excel-file/node')

// File path.
readXlsxFile(fileName).then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.

  rows1 = rows[0];

  console.log(rows1.length)

  text = []
  for (let i = 0; i < rows1.length; i++) {
    text.push(`\tcol${i} text`)
  }

  text = text.join(',\n')

create_table = `
CREATE TABLE IF NOT EXISTS  excel_to_postgres (
${text}
);
delete  from excel_to_postgres;
`

console.log(create_table)

insert_sql = ""

text = []
for (let j = 0; j < rows1.length; j++) {
  text.push(`col${j}`)
}

for (let i = 0; i < rows.length; i++) {
    row = rows[i]

   

    textValue = []
    for (let j = 0; j < row.length; j++) {
        textValue.push(`$$${row[j]}$$`)
    }

    textValue = textValue.join(',') 
    
    insert_sql += `insert into excel_to_postgres(${text}) values (${textValue});\n` 
  }


    const fs = require('fs');

    //const content = 'Some content!';

    fs.writeFile('./excel_to_postgres.sql', create_table + '\n' + insert_sql, err => {
    if (err) {
        console.error(err);
    }else {
        console.log("ok, output to file ./excel_to_postgres.sql")
    }
    // file written successfully
    });
  //console.log(rows)
})