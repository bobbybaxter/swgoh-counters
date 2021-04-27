# SWGOH Counters
A companion app for the mobile game Star Wars: Galaxy of Heroes, which provides PvP team counters using React.js on the client side, Node.js on the server side, and Google Sheets as a data store.

**Website:** [https://swgohcounters.com](https://swgohcounters.com)

**Wiki:** [https://github.com/bobbybaxter/swgoh-counters/wiki](https://github.com/bobbybaxter/swgoh-counters/wiki)

**Discord:** [https://discord.gg/eCnE48h](https://discord.gg/eCnE48h)

**Patreon:** [https://patreon.com/saiastrange](https://patreon.com/saiastrange)

## Screenshots
![image of star wars counters site](https://raw.githubusercontent.com/bobbybaxter/swgoh-counters/master/src/assets/swgohcountersScreenshot.png)

## Installation Instructions
- Clone down this repo
- At the root of the project, run `npm install`
- [DEPRECATED] To create your own Google Sheets backend, visit [Sheety](https://sheety.co/) for instructions on prepping the spreadsheets and getting the URLs, then replace the URLs within the data files within `src/helpers/data/`
  - note: visit my Google Sheet [here](https://docs.google.com/spreadsheets/d/1RVo7ej1PE06FKkwS1q5_slB9YLLQX3EF-dN98MkFmOM/edit#gid=1364839479) if you need help on the format

## How to Run
- In your terminal, type `npm start`

***Note**: if you want to make a production build of this project, type `npm run build`.  This will create a folder called build with all the minified code you need.*

## How to deploy
[DEPRECATED] Github Pages (I've currently moved away from this, but the functionality still works in this build):
- In your terminal, type `npm run deploy`
  - this will build what is currently on your branch and post it to your `origin gh-pages` ref, then delete the build folder

Client:
- In your terminal, type `npm run client:deploy`
  - this assumes you have installed the Amazon Web Services CLI and have created an S3 bucket
  - you will need to change the name of the bucket in `package.json` to the name of your bucket (which will normally also be your domain name), like so:
    ``` javascript
    "client:deploy": "npm run build && aws s3 sync build/ s3://{yourS3bucketname}"
    ```
  - this doesn't require a commit - it will build what is currently on your branch and sync it with your S3 bucket
  - if you don't have Versioning enabled on your S3 bucket, you may need to go into your AWS CloudFront Distribution and create an Invalidation to `/*` so you don't have to wait ~24 hours for CloudFront's CDNs to distribute the changes to your bucket.

Server:
- In your terminal, while in your server folder, type `eb deploy`
  - this assumes you have installed the Elastic Beanstalk CLI and initialized it (`eb init`) and created an Elastic Beanstalk instance for the server to run on (use `eb help` for help).
  - this will deploy the latest commit
