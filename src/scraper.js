const { insertDB } = require('./db.js');
const { logBot } = require('./bot.js');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrape() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage();
    try {
        await page.goto('https://e-nabavki.gov.mk/PublicAccess/home.aspx#/realized-contract', {
            waitUntil: 'networkidle2',
            timeout: 60000,
        })


        await page.waitForFunction(() => {
            const table = document.querySelector('.table-responsive table');
            if (!table) {
                return false;
            }

            const rows = table.querySelectorAll('tbody tr')
            return rows.length > 0 && rows[0].querySelectorAll('td').length > 0 && rows[0].querySelector('td').textContent.trim() !== ''
        }, {
            timeout: 120000,
            polling: 1000
        })

        const data = await page.evaluate(() => {
            let scrapedData = []
            const rows = document.querySelectorAll('tr')

            rows.forEach(row => {
                const cells = row.querySelectorAll('td')
                if(cells.length === 11) {
                    scrapedData.push({
                        brojNaOglas: cells[0]?.textContent.trim() || '/',
                        dogovorenOrgan: cells[1]?.textContent.trim() || '/',
                        predmetNaDogovor: cells[2]?.textContent.trim() || '/',
                        vidNaDogovor: cells[3]?.textContent.trim() || '/',
                        vidNaPostapka: cells[4]?.textContent.trim() || '/',
                        nositelNaNabavka: cells[5]?.textContent.trim() || '/',
                        vrednostSklucenDogovor: cells[6]?.textContent.replace('ден.','').trim() || '/',
                        vrednostRealiziranDogovor: cells[7]?.textContent.replace('ден.','').trim() || '/',
                        vrednostRealiziranIsplatenDogovor: cells[8]?.textContent.replace('ден.','').trim() || '/',
                        datumNaObjava: cells[9]?.textContent.trim() || '/',
                    })
                }
            })
            return scrapedData;
        })

        const newData = []
        for (const row of data) {
            const result = await insertDB(row);
            if(result) {
                newData.push(row)
            }
        }

        return newData;
    } catch (error) {
        await logBot(error)
        return [];
    }
    finally {
        await logBot('Finished scraping')
        await browser.close()
    }
}

module.exports = { scrape };