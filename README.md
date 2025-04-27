# eNabavki Notifier
Simple tool to monitor and notify about publicly available contracts in the Republic of Macedonia.
It checks for new contracts, stores them in a SQLite database and pushes notifications for each new contract to Discord.

## Quick Setup
1. Clone the repository `git clone https://github.com/nkvtd/eNabavki-Notifier.git`
2. Install dependencies `npm i`
3. Prepare bot by setting up variables in `.env` from `.env.sample`
4. Run using `npm start`