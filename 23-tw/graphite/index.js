const SDC = require('statsd-client');

const sdc = new SDC({
    host: 'graphite',
    prefix: 'my_app',
});

function increment(key) {
    sdc.increment(key);
}

module.exports = {
    increment,
}
