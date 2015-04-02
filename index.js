'use strict';

var Promise = require('promise');
var fs = require('fs-promise');
var path = require('path');
var request = require('request-promise');
var cheerio = require('cheerio');

var projects = path.join(__dirname, 'projects.json');

getProjectURLs(projects).then(
  requestAll).then(
  getVotes).then(
  console.log);

function getProjectURLs(file) {
  return fs.readFile(file).then(
    JSON.parse);
}

function requestAll(urls) {
  return Promise.all(urls.map(request));
}

function getVotes(htmls) {
  return htmls.map(parseBody);
}

function parseBody(html) {
  var $ = cheerio.load(html);
  return  [
    $('h1#page-title').text().trim(),
    $('.pane-node-flag-vote-1-count div').text().trim()
  ];
}



