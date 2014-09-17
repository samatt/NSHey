#!/usr/bin/env node

var fs = require('fs');
var sniffer = require('./sniffer.js');

var opts = require("nomnom").option('channels', {
  abbr: 'c',
  default: '1,6,11',
  help: 'Channels to search through (separate by commas)'
}).option('filename', {
  abbr: 'o',
  default: 'packets.log',
  help: 'Output file'
}).option('interface', {
  abbr: 'i',
  help: 'Interface (leave blank to autodetect)'
}).
option('interval', {
  abbr: 'r',
  default: '5000',
  help: 'How often to hop between channels'
}).parse();


  //font ANSI Shadow from http://patorjk.com/software/taag/
console.log(
  "\n" +
  "███╗   ██╗   ███████╗   ██╗  ██╗███████╗██╗  ██╗██╗   ██╗██╗   ██╗" + "\n" +
  "████╗  ██║   ██╔════╝   ██║  ██║██╔════╝╚██╗ ██╔╝╚██╗ ██╔╝╚██╗ ██╔╝" + "\n" +
  "██╔██╗ ██║   ███████╗   ███████║█████╗   ╚████╔╝  ╚████╔╝  ╚████╔╝ " + "\n" +
  "██║╚██╗██║   ╚════██║   ██╔══██║██╔══╝    ╚██╔╝    ╚██╔╝    ╚██╔╝  " + "\n" +
  "██║ ╚████║██╗███████║██╗██║  ██║███████╗   ██║      ██║      ██║   " + "\n" +
  "╚═╝  ╚═══╝╚═╝╚══════╝╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝      ╚═╝      ╚═╝   " + "\n"
);

opts.channels = opts.channels.split(',');
sniffer.start(opts);

console.log('Saving results to ' + opts.filename);

var i = 0;
var id = setInterval(function() {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  i = (i + 1) % 4;
  var dots = new Array(i + 1).join(".");
  process.stdout.write("Sniffing on channel " + sniffer.getCurrentChannel() + dots);
}, 300);

process.on('SIGINT', function() {
    console.log("\nSmell you later!");
    sniffer.stop();
    clearInterval(id);
});
