# CloudPalette

CloudPalette is an online image editor.

This project was developed as part of the LMU course CMSI 402.

check out the most recent working build at [www.cloudpalette.net](www.cloudpalette.net)

## Setting up CloudPalette on a Linux box

_(...with only slight modifications to get it working on other *nixes like OS/X)_

### Getting the CloudPalette source code
1. Get git<pre>
    sudo apt-get install git</pre>
1. Clone the repo!<pre>
    git clone git://github.com/hodavidhara/CloudPalette.git</pre>

### Getting the dependencies
1. Get **node** (follow the "Installing on Unix" instructions [here](https://github.com/joyent/node/wiki/Installation)). Make sure your terminal reads .profile on startup, if not put the echo instructions in a file that does get run (like .bash_profile or .bash_aliases)
1. Get NPM<pre>
    curl http://npmjs.org/install.sh | sh</pre>
1. Get dependences<pre>
    npm install -g express jade </pre>
1. Get dev dependences<pre>
    npm install -g vows </pre>

### Running the application
1. Navigate to the CloudPalette/app directory
1. Serve up the app<pre>
node app.js</pre>
1. Open your browser and go to [localhost:3030](localhost:3030)

### Running the unit tests
1. Navigate to the CloudPalette/test directory
2. Run the tests
<pre> vows * --spec </pre>

## Setting up in other operating systems
[lol](http://www.virtualbox.org/)