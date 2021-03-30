const gplay = require('google-play-scraper');
const term = require('terminal-kit').terminal;
const { config, keywords } = require('./constants');

var progressBar = 0;

start();

async function start() {
    console.clear();

    progressBar = term.progressBar({
        width: 80,
        title: 'Loading ASO Tool Data:',
        eta: true,
        percent: true
    });

    const result = await getStoreInfo();
    const ranks = await getKeywordData();
    console.clear();

    term.red.bold('Application Name: ')(result.title)("\n");
    term.red.bold('Application Installation: ')(result.installs)("\n");
    term.red.bold('Application Score: ')(result.score)("\n");
    term("\n");
    term("\n");
    term.yellow.bold('Keywords Ranks in ' + config.COUNTRY)("\n");

    for (let i = 0; i < ranks.length; i++) {
        const element = ranks[i];
        term.bold(`${element.keyword}: ${element.rank}`)("\n");
    }

    term("\n");
    term("\n");
    term.blue.bold('Created by Hasret Özkan')("\n");
    term.blue.bold('hasretozkan.me')("\n");
}

async function getKeywordData() {
    var ranks = [];

    for (let i = 0; i < keywords.length; i++) {
        const element = keywords[i];
        const data = await getKeywordRank(element, config.COUNTRY);
        ranks.push({ keyword: element.toUpperCase(), rank: data });

        const percent = (2 + i) / (1 + keywords.length);
        progressBar.update(percent);
    }

    ranks.sort(function (a, b) { return a.rank - b.rank });
    return ranks;
}

async function getStoreInfo() {
    const data = await gplay.app({ appId: config.APP_ID });
    const percent = 1 / (1 + keywords.length);
    progressBar.update(percent);
    return data;
}

async function getKeywordRank(key, country) {
    const data = await gplay.search({ term: key, num: 250, country: country });

    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.appId === config.APP_ID) {
            return i + 1;
        }
    }

    return 250;
}