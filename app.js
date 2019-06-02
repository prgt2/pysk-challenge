#! /usr/local/n/versions/node/12.2.0/bin/node

const [readline, fs, args, addrs] = [require('readline'), require('fs'), process.argv, require('./addrs.json')]
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
let search = cb => {
    let output = [], criteria = ''
    rl.question('Search by name or number?\n', answer => {
        criteria = answer
        if (criteria !== 'name' && criteria !== 'number') console.log(`Can't search by ${answer}`), rl.close()
        if (criteria === 'name') {
            rl.question('Insert searched name:\n', answer => {
                for(record of addrs.records) {
                    if (record.name === answer) output[output.length] = record
                }
                if (!output.length) {
                    console.log(`No matches in database for ${answer}`)
                    rl.close()
                } else {
                    if (cb) {
                        cb(output)
                    } else {
                        rl.close()
                    }
                }
            })
        } else if (criteria === 'number') {
            rl.question('Insert searched number\n', answer => {
                for(record of addrs.records) {
                    if (record.tel === answer) output[output.length] = record
                }
                if (!output.length) {
                    console.log(`No matches in database for ${answer}`)
                    rl.close()
                } else {
                    if (cb) {
                        cb(output)
                    } else {
                        rl.close()
                    }
                }
            })
        }
    })
}
let select = output => {
    console.table(output)
    rl.question('Specify id of record you want to edit from following records found in database, or create new record by typing \'0\'\n', answer => {
        if (isNaN(answer)) {
            console.log('Insert valid id')
            rl.close()
        } else if (answer !== 0) {
            for (record of output) {
                if (record.id === answer) output[0] = record, override(output), console.log('overridden'), rl.close()
            }
        } else {
            console.log(output)
            rl.close()
        }
    })
}
let override = output => {
    rl.question(`Edit record\nName (${addrs.records[output[0].id - 1].name}):  `, answer => {
        if (answer) addrs.records[output[0].id - 1].name = answer
        rl.question(`Telephone number (${addrs.records[output[0].id - 1].tel}):  `, answer => {
            if (answer) addrs.records[output[0].id - 1].name = answer
            rl.question(`Street (${addrs.records[output[0].id - 1].adress[0].street}):  `, answer => {
                if (answer) addrs.records[output[0].id - 1].adress[0].street = answer
                rl.question(`City (${addrs.records[output[0].id - 1].adress[0].city}):  `, answer => {
                    if (answer) addrs.records[output[0].id - 1].adress[0].city = answer
                    rl.question(`E-mail (${addrs.records[output[0].id - 1].email}):  `, answer => {
                        if (answer) addrs.records[output[0].id - 1].email = answer
                        fs.writeFile('./addrs.json', JSON.stringify(addrs), () => {
                            console.log(addrs)
                            rl.close()
                        })
                    })
                })
            })
        })
    })
}
if (args[2] === '-h' || args[2] === '--help' || !args[2]) {
    fs.readFile('./help.md', 'UTF-8', (err, data) => err ? console.log(err) : console.log(data))
}
if (args[2] === '-get' && !args[3]) {
    search( output => {
        console.table(output)
    })
}
if (args[2] === '-get' && args[3] === '-a') {
    let output = []
    for (record of addrs.records) output[output.length] = record
    console.table(output)
}
if (args[2] === '-post') {
    //readline like json, then new object - push
    function NewRecord(name, tel, address = [street, city], email) {
        this.id = addrs.records.length + 1;
        this.name = name;
        this.tel = tel;
        this.adress = address;
        this.email = email;
    }
    let name = '', tel = '', address = [{'street': ''},{'city': ''}], email = ''
    rl.question('Create new record\nName:  ', answer => {
        name = answer
        rl.question('Telephone number:  ', answer => {
            tel = answer
            rl.question('Street:  ', answer => {
                address[0].street = answer
                rl.question('City:  ', answer => {
                    address[1].city = answer
                    rl.question('E-mail:  ', answer => {
                        email = answer
                        let newRecord = new NewRecord(name, tel, address, email)
                        addrs.records[addrs.records.length] = (newRecord)
                        fs.writeFile('./addrs.json', JSON.stringify(addrs), () => {
                            console.log(addrs)
                            rl.close()
                        })
                    })
                })
            })
        })
    })
}
if (args[2] === '-put') {
    //get + post funcionality
    search( output => {
        (output.length === 1) ? override(output) : select(output)
    })
}
if (args[2] === '-del') {
    //get + del
}
/* adresses.records[0].name = 'Udo'
fs.writeFile('./addrs.json', JSON.stringify(adresses), () => console.log('done'))
 */
