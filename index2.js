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
  interview_id int4, id int4,
${text}
);
delete  from excel_to_postgres;
`

console.log(create_table)

insert_sql = ""

text = ['interview_id','id']
for (let j = 0; j < rows1.length; j++) {
  text.push(`col${j}`)
}

for (let i = 0; i < rows.length; i++) {
    row = rows[i]

    textValue = [0, i]
  
    for (let j = 0; j < row.length; j++) {
  
      if(j == 6 || j == 7 ){

            try {
              date1 = Date.parse(row[j])

             // toLocaleString()

              date1 = new Date(date1)
              m = date1.getUTCMinutes() 
              h = date1.getUTCHours()
              if(m == 0 ) m = '00'
              if(h == 0 ) h = '00'
  
              date1 = "" + h + ":" + m 

              textValue.push(`$$${date1}$$`)

            }
            catch(err) {
              console.log(err) 
            }          

            //textValue.push(`$$${row[j]}$$`)
        }
        else if(j == 24){
          try {
            date1 = Date.parse(row[j])

           // toLocaleString()

            d = new Date(date1)
            let day = d.getUTCDate();
            let month = d.getUTCMonth();
            let year = d.getUTCFullYear();

           

            date1 = "" + year + "/" + (month + 1) + "/" + day

            textValue.push(`$$${date1}$$`)

          }
          catch(err) {
            console.log(err) 
          }        

        } else if (j == 3 || j == 2){
          manager = row[j]?.toLowerCase().replace('@fpt.com.vn', '') 

          textValue.push(`$$${manager}$$`)
        }
        
        else 
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