'use strict';

// module dependencies.
var fs = require('fs'),
    chalk = require('chalk');

// file name for markets passed in on the command line
var dataSource = process.argv[2];

// error handling
if(!dataSource) {
    console.log(chalk.bold.red('WARNING: you need to pass your markets text file as an argument on the command line.'));
    process.exit(1);
    return
}

// prepare data for processing
var text = fs.readFileSync(dataSource, 'utf8');
var linesArray = text.split('\n');

// store for new format
var Markets = [];

// market class
var Market = function(args) {
    this.ev_mkt_id = args.ev_mkt_id,
    this.sort = args.sort,
    this.ev_id = args.ev_id,
    this.desc = args.desc,
    this.start_time = args.start_time
};

// temp object
var market = {};

// iterate through text file of markets
for (var i = 0; i < linesArray.length; i++) {

    // determines when a new market is added to the Markets array
    var remainder = (i + 1) % 6;
    var data = linesArray[i].split(/(\s+)/);

    // apply specific methods to see segment
    if(data[0] === 'ev_mkt_id')
        market.ev_mkt_id = data[2];

    if(data[0] === 'sort')
        market.sort = data[2];

    if(data[0] === 'ev_id')
        market.ev_id = data[2];

    if(data[0] === 'desc') {
        // create a string from the array elements
        var details = '';
        for (var x = 1; x < data.length; x++) {
            // remove carriage return and unrequired white space
            var info = data[x].replace(/\r$/, '').replace(/ +(?= )/g,'');
            if(info.length > 0)
                details += info;
        }
        market.desc = details.trim();
    }

    if(data[0] === 'start_time')
        market.start_time = data[2] + ' ' + data[4];

    if(remainder === 0) {
        // instantiate new instance of Market class with temp market
        var newMarket = new Market(market);
        // add Market to store
        Markets.push(newMarket);
        // clear temp market
        market = {};
    }

    // log out final process
    if(i === linesArray.length - 1)
        console.log(chalk.green('Finished processing markets.'));
}

var outputFileName = 'markets-transposed.txt';
var stream = fs.createWriteStream('./' + outputFileName);

stream.once('open', function(f) {

    console.log(chalk.green('Number of markets processed \t'), Markets.length);
    console.log('--');
    console.log('Writing markegts to new file');
    // add data to new file
    Markets.forEach(function(m) {
            stream.write(m.ev_mkt_id + ',' + m.sort + ',' + m.ev_id + ',' + m.desc + ',' + m.start_time + '\n');
    });
    // close
    stream.end();
    console.log('--');
    console.log(chalk.green('DONE.\t Please see' + outputFileName + ' in the root of this project'));
});
