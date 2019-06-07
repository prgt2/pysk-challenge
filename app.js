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
        if (criteria !== 'name' && criteria !== 'number') console.log(`Can't search by ${answer}`), search()
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
                    if (record.number === answer) output[output.length] = record
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
let select = (output, cb) => {
    console.table(output)
    rl.question('Specify id of record you want to edit from following records found in database, or create new record by typing \'0\'\n', answer => {
        if (isNaN(answer) || answer === '') {
            console.log('Insert valid id')
            rl.close()
        } else if (answer !== '0') {
            for (record of output) {
                if (record.id == answer) {
                    output = [record]
                    cb(output)
                    break
                }
            }
        } else {
            post()
        }
    })
}
let post = () => {
    function NewRecord(name, number, address = [street, city], email) {
        this.id = addrs.records.length + 1;
        this.name = name;
        this.number = number;
        this.address = address;
        this.email = email;
    }
    let name = '', number = '', address = [{'street': ''},{'city': ''}], email = ''
    rl.question('Create new record\nName:  ', answer => {
        name = answer
        rl.question('Telephone number:  ', answer => {
            number = answer
            rl.question('Street:  ', answer => {
                address[0].street = answer
                rl.question('City:  ', answer => {
                    address[1].city = answer
                    rl.question('E-mail:  ', answer => {
                        email = answer
                        let newRecord = new NewRecord(name, number, address, email)
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
let override = output => {
    console.log(output[0].id)
    rl.question(`Edit record\nName (${addrs.records[output[0].id - 1].name}):  `, answer => {
        if (answer) addrs.records[output[0].id - 1].name = answer
        rl.question(`Telephone number (${addrs.records[output[0].id - 1].number}):  `, answer => {
            if (answer) addrs.records[output[0].id - 1].name = answer
            rl.question(`Street (${addrs.records[output[0].id - 1].address[0].street}):  `, answer => {
                if (answer) addrs.records[output[0].id - 1].address[0].street = answer
                rl.question(`City (${addrs.records[output[0].id - 1].address[0].city}):  `, answer => {
                    if (answer) addrs.records[output[0].id - 1].address[0].city = answer
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
let deletio = output => {
    for (record of addrs.records) {
        if (record.name == output[0].name && record.number == output[0].number) {
            addrs.records.splice(record.id - 1, 1)
            break
        }
    }
    update()
}
let update = () => {
    addrs.records.forEach((record, index) => {
        if (record.id !== index + 1) record.id = index + 1
    })
    fs.writeFile('./addrs.json', JSON.stringify(addrs), () => rl.close())
}
if (args[2] === '-h' || args[2] === '--help' || !args[2]) {
    fs.readFile('./help.md', 'UTF-8', (err, data) => err ? console.log(err) : console.log(data))
    process.exit()
}
if (args[2] === '-get' && !args[3]) {
    search( output => {
        console.table(output)
        process.exit()
    })
}
if (args[2] === '-get' && args[3] === '-a') {
    let output = []
    for (record of addrs.records) output[output.length] = record
    console.table(output)
    proccess.exit()
}
if (args[2] === '-post') {
    post()
}
if (args[2] === '-put') {
    search( output => {
        output.length === 1 ? override(output) : select(output, override)
    })
}
if (args[2] === '-del') {
    search( output => {
        output.length === 1 ? deletio(output) : select(output, deletio)
    })
}