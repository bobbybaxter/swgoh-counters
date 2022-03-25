# SWGOH Counters
> In light of the news that swgoh.gg is discontinuing their public API, I'm forced to discontinue support for swgohcounters.com, as of March 24, 2022.

> I started the site in July 2019 as a capstone project for the dev bootcamp I was attending.  I threw it up on Reddit and it got way more attention than I was expecting.  Back then, I even had a dev from swgoh.gg ask if I was going to build an API because they were considering implementing counters into their site.

> At the beginning of 2020, my work and the wider playerbase's interest in this project helped me change careers and land my first developer job.  I spent months planning and building out a solution to completely move from Google Sheets to a server, which came with more upkeep costs.  Adding Google Adsense and a Patreon barely kept the lights on, but it worked all thanks to you.

> Last year, I continued improving the site and my user base grew so much that upkeep costs eventually doubled my Adsense and Patreon revenue.  I unfortunately had to paywall certain features of the site.  But again, thanks to my new Patrons, the project was able to stay afloat.

> This year, I created a new Search tool, spent a lot of time working on content and counter strategies, and was ready to roll out my Discord bot to users next week.  However, without the swgoh.gg API, I'll be unable to verify player guilds and allow guild-level access to features - a core feature of my Patreon tiers.  And due to the upkeep costs, the site simply can't survive without Patreon support.  I've asked for developer access and even offered to pay for access to the swgoh.gg API, but I've been denied due to being a competitor.

> So what happens next?

> My site will continue to stay up for as long as I'm able to keep it up, so I'm able to show future employers my work.  However, I don't plan to update it with new content and I may gradually deprecate parts of the site as I work to reduce or eliminate the upkeep costs.

> I've suspended the April billing cycle for Patrons, so you won't be charged next week.  For Patrons with annual memberships, give me time to figure things out and I'll provide you all a prorated refund.

> I plan to keep the Discord up for another month or so, or at least until I'm finished refunding all Patrons with annual memberships.

> As a developer, I could've easily picked up contract gigs over the past 2-3 years and actually profited from my work.  Instead, I worked on this project and made the equivalent of less than three weeks' worth of pay over that time period.  Even then, I'm very grateful because your support and interest allowed me to work on a project that I deeply care about.  I've learned a lot over these past three years and I'm happy I was able to help you all along the way.

## What is this app?

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

## Deprecation To-do List
- [ ] Refund Annual Patrons
- [ ] Deactivate DigitalOcean droplet for Discord Bot
- [ ] Replace Patreon endpoints with mock data
- [ ] Deactivate Patreon
- [ ] Replace swgoh.gg endpoints with mock data
- [ ] Replace Firebase endpoints with mock data
- [ ] Update login functionality to select mock roles to view site
- [ ] Replace AWS endpoints with mock data
- [ ] Find free or low-cost hosting for site
- [ ] Deactivate AWS services
- [ ] Update README on new mock site functionality