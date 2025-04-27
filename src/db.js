const {resolve} = require("node:path");
const {logBot} = require("./bot");
const sqlite = require('sqlite3').verbose();
const fs = require('fs');

const dataPath = './data';
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
}

const DBPath = resolve(__dirname, '../data/database.db');
const database = new sqlite.Database(DBPath);

database.run(`
    CREATE TABLE IF NOT EXISTS dogovori (
        brojNaOglas TEXT,
        dogovorenOrgan TEXT,
        predmetNaDogovor TEXT,
        vidNaDogovor TEXT,
        vidNaPostapka TEXT,
        nositelNaNabavka TEXT,
        vrednostSklucenDogovor TEXT,
        vrednostRealiziranDogovor TEXT,
        vrednostRealiziranIsplatenDogovor TEXT,
        datumNaObjava TEXT,
    UNIQUE (
        brojNaOglas,
        vrednostSklucenDogovor,
        vrednostRealiziranDogovor,
        vrednostRealiziranIsplatenDogovor
        )
    )
`);

function insertDB(data) {
    return new Promise((resolve, reject) => {
        database.run(
            `INSERT OR IGNORE INTO dogovori (
                brojNaOglas, 
                dogovorenOrgan, 
                predmetNaDogovor, 
                vidNaDogovor, 
                vidNaPostapka,
                nositelNaNabavka, 
                vrednostSklucenDogovor, 
                vrednostRealiziranDogovor,
                vrednostRealiziranIsplatenDogovor, 
                datumNaObjava
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.brojNaOglas,
                data.dogovorenOrgan,
                data.predmetNaDogovor,
                data.vidNaDogovor,
                data.vidNaPostapka,
                data.nositelNaNabavka,
                data.vrednostSklucenDogovor,
                data.vrednostRealiziranDogovor,
                data.vrednostRealiziranIsplatenDogovor,
                data.datumNaObjava
            ],
            function (error) {
                if (error) {
                    logBot(error)
                    reject(error)
                }
                else {
                    resolve(this.lastID)
                }
            }
        );
    });
}

module.exports = { insertDB };