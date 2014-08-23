#!/usr/bin/env node

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

  sniffer.sniff(interfaceName, opts.output);
  sniffer.hop(opts.channels.split(','));
});

