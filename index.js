'use strict';

var Promise = require('promise');
var fs = require('fs-promise');
var path = require('path');
var request = require('request-promise');
var cheerio = require('cheerio');
var Table = require('easy-table');

var projects = path.join(__dirname, 'projects.json');

getProjectURLs(projects).then(
  requestAll).then(
  getVotes).then(
  createTable).then(
  print).catch(
  console.error.bind(console));

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

function createTable(rows) {
  rows.sort(function(a, b) {
    return toNum(b[1]) - toNum(a[1]);
  });

  var table = new Table();
  rows.forEach(function(project, i) {
    table.cell('Lp.', i + 1);
    table.cell('Projekt', project[0], shortStr);
    table.cell('Głosy', toNum(project[1]), Table.Number(0));
    table.newRow();
  });
  return table;
}

function shortStr(str) {
  if (str.length > 50) {
    return str.slice(0, 49) + '…';
  } else {
    return str;
  }
}

function toNum(str) {
  var val = parseInt(str);
  return isNaN(val) ? 0 : val;
}

function print(table) {
  console.log(table.toString());
}
