const moment = require('moment')

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a') //得到当前时间 有hour minute am/pm
    }
}

module.exports = formatMessage;