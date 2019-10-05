# SWGOH Counters
A companion app for the mobile game Star Wars: Galaxy of Heroes, which provides PvP team counters using React.js as a front-end framework and Google Sheets as a back-end.

**Website:** [https://bobbybaxter.github.io/swgoh-counters](https://bobbybaxter.github.io/swgoh-counters)

**Wiki:** [https://github.com/bobbybaxter/swgoh-counters/wiki](https://github.com/bobbybaxter/swgoh-counters/wiki)

**Discord:** [https://discord.gg/eCnE48h](https://discord.gg/eCnE48h)

**Patreon:** [https://patreon.com/saiastrange](https://patreon.com/saiastrange)

## Screenshots
![image of star wars counters site](https://raw.githubusercontent.com/bobbybaxter/swgoh-counters/master/src/assets/screenshot.png)

## Installation Instructions
- Clone down this repo
- At the root of the project, run `npm install`
- To create your own Google Sheets backend, visit [Sheety](https://sheety.co/) for instructions on prepping the spreadsheets and getting the URLs, then replace the URLs within the data files within `src/helpers/data/`
  - note: visit my Google Sheet [here](https://docs.google.com/spreadsheets/d/1RVo7ej1PE06FKkwS1q5_slB9YLLQX3EF-dN98MkFmOM/edit#gid=1364839479) if you need help on the format

## How to Run
- In your terminal, type `npm start`

***Note**: if you want to make a production build of this project, type `npm run build`.  This will create a folder called build with all the minified code you need.*

## How to deploy
- In your terminal, type `npm run deploy`
