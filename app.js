#! /usr/local/n/versions/node/12.2.0/bin/node

const [readline, fs, args, addrs] = [require('readline'), require('fs'), process.argv, require('./addrs.json')]

if (args[2] === '-h' || args[2] === '--help' || !args[2]) {
    fs.readFile('./help.md', 'UTF-8', (err, data) => err ? console.log(err) : console.log(data))
}
if (args[2] === '-get' && !args[3]) {
    let output = [], criteria = ''
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.question('Search by name or number?\n', answer => {
        criteria = answer
        if (criteria !== 'name' && criteria !== 'number') console.log(`Can't search by ${answer}`), rl.close()
        if (criteria === 'name') {
            rl.question('Insert searched name:\n', answer => {
                for(record of addrs.records) {
                    if (record.name === answer) output[output.length] = record, console.table({...output})
                }
                if (!output.length) console.log(`No matches in database for ${answer}`)
                rl.close()
            })
        } else if (criteria === 'number') {
            rl.question('Insert searched number\n', answer => {
                for(record of addrs.records) {
                    if (record.tel === answer) output[output.length] = record, console.table({...output})
                }
                if (!output.length) console.log(`No matches in database for ${answer}`)
                rl.close()
            })
        }
    })
}
if (args[2] === '-get' && args[3] === '-a') {
    //get all and parse
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
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
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
    let output = [], criteria = ''
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.question('Search by name or number?\n', answer => {
        let override = () => {
            rl.question(`Edit record\nName (${record.name}):  `, answer => {
                if (answer) record.name = answer
                rl.question(`Telephone number (${record.tel}):  `, answer => {
                    if (answer) record.tel = answer
                    rl.question(`Street (${record.adress[0].street}):  `, answer => {
                        if (answer) record.address[0].street = answer
                        rl.question(`City (${record.adress[0].city}):  `, answer => {
                            if (answer) record.address[1].city = answer
                            rl.question(`E-mail (${record.email}):  `, answer => {
                                if (answer) record.email = answer
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
        let select = () => {
            rl.question('Specify id of record you want to edit from following records found in database, or create new record by typing \'0\'\n', answer => {
                if (isNaN(answer)) {
                    console.log('Insert valid id')
                    rl.close()
                } else if (answer !== 0) {
                    for (record of output) {
                        if (record.id === answer) override(record), console.log('overridden')
                    }
                } else {
                    post()
                }
                console.log(output)
            })
        }
        criteria = answer
        if (criteria !== 'name' && criteria !== 'number') console.log(`Can't search by ${answer}`), rl.close()
        if (criteria === 'name') {
            rl.question('Insert searched name:\n', answer => {
                for(record of addrs.records) {
                    if (record.name === answer) output[output.length] = record, console.table({...output})
                }
                if (!output.length) {
                    console.log(`No matches in database for ${answer}`)
                } else if (output.length === 1) {
                    override(output[0])
                } else {
                    select()
                }
            })
        } else if (criteria === 'number') {
            rl.question('Insert searched number\n', answer => {
                for(record of addrs.records) {
                    if (record.tel === answer) output[output.length] = record, console.table({...output})
                }
                if (!output.length) console.log(`No matches in database for ${answer}`)
                rl.close()
            })
        }
    })
}
if (args[2] === '-del') {
    //get + del
}
/* adresses.records[0].name = 'Udo'
fs.writeFile('./addrs.json', JSON.stringify(adresses), () => console.log('done'))
 */