## Market Text File Parser

### Update
This has been re written in ES6.

#### Prerequisites
Make sure you have installed on your machine:
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.


#### Cloning The GitHub Repository

```bash
$ git clone https://github.com/Matt-Webb/market-txt-parser.git
```
#### Install dependencies

```bash
$ npm install
```
#### Run the program

```bash
$ node parse.markets.js markets.txt
```

**note:** you need to pass in your markets text file as a command line argument (as shown in the example above 'markets.txt').

If you wish to change the file out put name, change line 81 of _parse.markets.js_:

```bash
var outputFileName = 'markets-transposed.txt';
```
##### Author
[Matthew D Webb](http://webb.digital)
