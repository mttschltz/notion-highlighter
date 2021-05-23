// var browser = require("webextension-polyfill");
import optionsStorage from './options-storage.js';

console.log('optionssync', JSON.stringify(optionsStorage))

optionsStorage.syncForm('#options-form');

document.getElementById('test-log-button').addEventListener('click', () => {
    optionsStorage.getAll().then((options) => console.log(`options=${JSON.stringify(options)}`))
})