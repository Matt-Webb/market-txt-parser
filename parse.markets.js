"use strict";

// module dependencies.
const fs = require( 'fs' ),
    chalk = require( 'chalk' );

// file name for markets passed in on the command line
const dataSource = process.argv[ 2 ];

// error handling
if ( !dataSource ) {
    console.log( chalk.bold.red( 'WARNING: \t You need to pass your markets text file as an argument on the command line. Please try again.' ) );
    console.log( chalk.yellow( 'Example: \t $ node parse.markets.js markets.txt' ) );
    process.exit( 1 );
    return;
}

// prepare data for processing
const text = fs.readFileSync( dataSource, 'utf8' );
const linesArray = text.split( '\n' );
console.log( '\t -------------------------------------------------------------------------' );
console.log( chalk.green( '\t 1.) \t Process initiated.' ) );
// store for new format
let Markets = [];

// market class
let Market = args => {
    this.ev_mkt_id = args.ev_mkt_id,
        this.sort = args.sort,
        this.ev_id = args.ev_id,
        this.desc = args.desc,
        this.start_time = args.start_time
};

// temp object
let market = {};

// iterate through text file of markets
for ( let i = 0; i < linesArray.length; i++ ) {

    // determines when a new market is added to the Markets array
    let remainder = ( i + 1 ) % 6;
    let data = linesArray[ i ].split( /(\s+)/ );

    // apply specific methods to see segment
    if ( data[ 0 ] === 'ev_mkt_id' )
        market.ev_mkt_id = data[ 2 ];

    if ( data[ 0 ] === 'sort' )
        market.sort = data[ 2 ];

    if ( data[ 0 ] === 'ev_id' )
        market.ev_id = data[ 2 ];

    if ( data[ 0 ] === 'desc' ) {
        // create a string from the array elements
        let details = '';
        TODO: switch to Array.prototype.forEach 
        for ( let x = 1; x < data.length; x++ ) {
            // remove carriage return and unrequired white space
            let info = data[ x ].replace( /\r$/, '' ).replace( / +(?= )/g, '' );
            if ( info.length > 0 )
                details += info;
        }        
        market.desc = details.trim();
    }

    if ( data[ 0 ] === 'start_time' )
        market.start_time = data[ 2 ] + ' ' + data[ 4 ];

    if ( remainder === 0 ) {
        // instantiate new instance of Market class with temp market
        let newMarket = new Market( market );
        // add Market to store
        Markets.push( newMarket );
        // clear temp market
        market = {};
    }

    // log out final process
    if ( i === linesArray.length - 1 )
        console.log( chalk.green( '\t 2.) \t Finished processing markets.' ) );
}

let outputFileName = 'markets-transposed.txt';
let stream = fs.createWriteStream( './' + outputFileName );

stream.once( 'open', f => {

    console.log( chalk.green( '\t 3.) \t Number of markets processed |' ), Markets.length );
    console.log( chalk.green( '\t 4.) \t Writing markets to new file' ) );
    // add data to new file
    Markets.forEach( m => {
        stream.write( m.ev_mkt_id + ',' + m.sort + ',' + m.ev_id + ',' + m.desc + ',' + m.start_time + '\n' );
    } );
    // close
    stream.end();
    console.log( '\t -------------------------------------------------------------------------' );
    console.log( chalk.green( `\t DONE.\t Please see ${outputFileName} in the root of this project` ) );
    console.log( '\t -------------------------------------------------------------------------' );
} );
