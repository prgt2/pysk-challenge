#! /usr/local/n/versions/node/12.2.0/bin/node

const [readline, fs, args, addrs] = [require('readline'), require('fs'), process.argv, require('./addrs.json')]

if (args[2] === '-h' || args[2] === '--help' || !args[2]) {
    fs.readFile('./help.md', 'UTF-8', (err, data) => err ? console.log(err) : console.log(data))
}
if (args[2] === '-get' && !args[3]) {
    let output = '', criteria = ''
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
                    if (record.name === answer) output = record, console.table({...output})
                }
                if (!output) console.log(`No matches in database for ${answer}`)
                rl.close()
            })
        } else if (criteria === 'number') {
            rl.question('Insert searched number\n', answer => {
                for(record of addrs.records) {
                    if (record.tel === answer) output = record, console.table({...output})
                }
                if (!output) console.log(`No matches in database for ${answer}`)
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
    rl.question('Create new record\nName:\n', answer => {
        name = answer
        rl.question('Telephone number:\n', answer => {
            tel = answer
            rl.question('Street:\n', answer => {
                address[0].street = answer
                rl.question('City:\n', answer => {
                    address[1].city = answer
                    rl.question('E-mail:\n', answer => {
                        email = answer
                        let newRecord = new NewRecord(name, tel, address, email)
                        addrs.records[addrs.records.length] = (newRecord)
                        fs.writeFile('./addrs.json', JSON.stringify(addrs), () => {})
                        console.log(addrs)
                        rl.close()
                    })
                })
            })
        })
    })
}
if (args[2] === '-put') {
    //get + post funcionality
    let output = '', criteria = ''
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.question('Search by name or number?\n', answer => {
        criteria = answer
        if (criteria !== 'name' && criteria !== 'number') console.log(`Can't search by ${answer}`), rl.close()
        console.table([answer, typeof answer, answer === 'name', criteria, typeof criteria, answer === criteria])
        if (criteria === 'name') {
            rl.question('Insert searched name:\n', answer => {
                console.log('starting search...')
                for(record of addrs.records) {
                    console.log('looping...')
                    if (record.name === answer) output = record, console.table({...output})
                }
                if (!output) console.log(`No matches in database for ${answer}`)
                rl.close()
            })
        } else if (criteria === 'number') {
            rl.question('Insert searched number\n', answer => {
                for(record of addrs.records) {
                    if (record.tel === answer) output += record, console.table({...output})
                }
                if (!output) console.log(`No matches in database for ${answer}`)
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