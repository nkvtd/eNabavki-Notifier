require('dotenv').config();
const cron = require('node-cron');
const { scrape } = require('./scraper.js');
const { announceBot, loginBot, logBot } = require('./bot.js');

async function run() {
    const data = await scrape()
    if(data.length > 0) {
        await announceBot(data)
    }
}

(async () => {
    await loginBot()

    await new Promise(resolve => setTimeout(resolve, 1000))

    await logBot('Initial scraping')
    await run()

    cron.schedule('0 * * * *', async () => {
        try {
            await logBot('Scheduled scraping')
            await run()
        } catch (error) {
            await logBot(error)
            return [];
        }
    })
})();