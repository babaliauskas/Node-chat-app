const moment = require('moment');

const createdAt = new Date(Date.now());
const date = moment(new Date(Date.now()));
console.log(date.format('LLL'));
