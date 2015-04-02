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
  var table = new Table();
  rows.forEach(function(project) {
    table.cell('Projekt', project[0]);
    table.cell('Głosy', project[1]);
    table.newRow();
  });
  table.sort(['Głosy|des']);
  return table;
}

function print(table) {
  console.log(table.toString());
}
