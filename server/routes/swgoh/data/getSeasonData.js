/* eslint-disable no-await-in-loop */
const axios = require('axios');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

module.exports = app => async ({ leaderIds, season }) => {
  const baseURL = process.env.SWGOH_BASE_URL;

  const swgohData = [];

  const optionsLength = 3;
  async function makeRequest({ leaderId, page = 1 }) {
    const response = await axios({
      method: 'GET',
      baseURL,
      url: `${leaderId}`,
      params: {
        page,
        season,
        sort: 'count',
      },
    });

    const { document } = (new JSDOM(response.data)).window;
    return document;
  }

  async function checkPagination(document) {
    const paginationDiv = document.querySelector('.pagination');
    let lastPage;
    if (paginationDiv) {
      const page = document.querySelector('.pagination').children;
      Array.from(page).forEach(item => {
        const trimmedItem = item.textContent.replace(/\s+/g, ' ').trim().split(' ');
        if (trimmedItem.includes('Page')) {
          lastPage = trimmedItem[3]; // eslint-disable-line prefer-destructuring
        }
      });
    } else {
      lastPage = 1;
    }
    return lastPage;
  }

  async function parseDom({ leaderId, document }) {
    return Array.from(document.querySelectorAll('div.panel > .row')).forEach((panel, i) => {
      const counterSquad = [];
      const opponentSquad = [leaderId];
      let seen = '';
      let winPerc = '';
      let avgBanners = '';
      const divElement = panel.children;
      // gets counterSquad
      divElement
        .item(0)
        .querySelectorAll('a')
        .forEach(x => counterSquad.push(x.href.split('=')[optionsLength]));

      // gets counterStats
      divElement
        .item(1)
        .querySelectorAll('strong')
        .forEach((x, j) => {
          const value = x.nextSibling.nextSibling.textContent.replace(/\s+/g, ' ').trim();
          if (j === 0) {
            seen = value;
          }
          if (j === 1) {
            winPerc = value;
          }
          if (j === 2) {
            avgBanners = value;
          }
        });

      // gets opponentSquad
      divElement
        .item(2)
        .querySelectorAll('a')
        .forEach(x => opponentSquad.push(x.href.split('=')[optionsLength]));

      for (let k = 0; k <= 4; k += 1) {
        if (!counterSquad[k]) { counterSquad[k] = 'BLANK'; }
        if (!opponentSquad[k]) { opponentSquad[k] = 'BLANK'; }
      }

      return swgohData.push({
        counterSquad,
        seen,
        winPerc,
        avgBanners,
        opponentSquad,
      });
    });
  }

  async function getDataForLeader(leaderId) {
    const firstResponse = await makeRequest({ leaderId });
    const lastPage = await checkPagination(firstResponse);

    for (let i = 1; i <= lastPage; i += 1) {
      const document = await makeRequest({ leaderId, page: i });
      await parseDom({ leaderId, document });
      console.info(`${leaderId} - ${i} parsed`);
    }
  }

  async function start() {
    try {
      await Promise.all(leaderIds.map(async leaderId => {
        try {
          await getDataForLeader(leaderId);
        } catch (err) {
          console.error(err);
          throw err;
        }
      }));
      return swgohData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return start();
};
