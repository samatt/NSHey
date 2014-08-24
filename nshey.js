#!/usr/bin/env node

var fs = require('fs');
var sniffer = require('./sniffer.js');

var opts = require("nomnom").option('channels', {
  abbr: 'c',
  default: '1,6,11',
  help: 'Channels to search through (separate by commas)'
}).option('output', {
  abbr: 'o',
  default: 'packets.log',
  help: 'Output file'
}).option('interface', {
  abbr: 'i',
  help: 'Interface (leave blank to autodetect)'
}).parse();

sniffer.getInterface(function(obj) {
  var interfaceName;

  if (opts.interface) {
    interfaceName = opts.interface;
  } else {
    if (obj) {
      interfaceName = obj.name;
    } else {
      interfaceName = 'en0';
    }
  }

  sniffer.sniff(interfaceName, function(data) {
    fs.appendFile(opts.output, data, function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

  sniffer.hop(opts.channels.split(','));

  //font ANSI Shadow from http://patorjk.com/software/taag/
  console.log(
    "\n" +
    "███╗   ██╗   ███████╗   ██╗  ██╗███████╗██╗   ██╗██╗   ██╗██╗   ██╗" + "\n" +
    "████╗  ██║   ██╔════╝   ██║  ██║██╔════╝╚██╗ ██╔╝╚██╗ ██╔╝╚██╗ ██╔╝" + "\n" +
    "██╔██╗ ██║   ███████╗   ███████║█████╗   ╚████╔╝  ╚████╔╝  ╚████╔╝ " + "\n" +
    "██║╚██╗██║   ╚════██║   ██╔══██║██╔══╝    ╚██╔╝    ╚██╔╝    ╚██╔╝  " + "\n" +
    "██║ ╚████║██╗███████║██╗██║  ██║███████╗   ██║      ██║      ██║   " + "\n" +
    "╚═╝  ╚═══╝╚═╝╚══════╝╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝      ╚═╝      ╚═╝   " + "\n"
  );

  console.log('Saving results to ' + opts.output);

  var i = 0;
  setInterval(function() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    i = (i + 1) % 4;
    var dots = new Array(i + 1).join(".");
    process.stdout.write("Sniffing on channel " + sniffer.getCurrentChannel() + dots);
  }, 300);
});
