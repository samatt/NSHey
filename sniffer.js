#!/usr/bin/env node

var spawn = require('child_process').spawn;
var fs = require('fs');
var network = require('network');

var channelIndex = 0;
var channelHopper, outputFile, channels;

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

outputFile = opts.output;
channels = opts.channels.split(',');

network.get_active_interface(function(err, obj) {
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

  sniff(interfaceName);
  hop();
});


var hop = function() {
  if (channelHopper) {
    channelHopper.kill();
  }

  if (channelIndex < (channels.length-1) ){
    channelIndex ++;
  } else{
    channelIndex = 0;
  }

  channelHopper = spawn('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport', ['sniff', channels[channelIndex]]);

  channelHopper.stdout.on('data', function (data) {
    console.log('airport stdout: ' + data);
  });

  channelHopper.stderr.on('data', function (data) {
    console.log('airport stderr: ' + data);
  });

  setTimeout(hop, 10000);
};

var sniff = function(interfaceName) {
  console.log(
    "\n" +
    "███╗   ██╗███████╗██╗  ██╗███████╗██╗   ██╗██╗   ██╗██╗   ██╗" + "\n" +
    "████╗  ██║██╔════╝██║  ██║██╔════╝╚██╗ ██╔╝╚██╗ ██╔╝╚██╗ ██╔╝" + "\n" +
    "██╔██╗ ██║███████╗███████║█████╗   ╚████╔╝  ╚████╔╝  ╚████╔╝ " + "\n" +
    "██║╚██╗██║╚════██║██╔══██║██╔══╝    ╚██╔╝    ╚██╔╝    ╚██╔╝  " + "\n" +
    "██║ ╚████║███████║██║  ██║███████╗   ██║      ██║      ██║   " + "\n" +
    "╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝      ╚═╝      ╚═╝   " + "\n"
  );

  console.log('Saving results to ' + outputFile);

  var i = 0;
  setInterval(function() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    i = (i + 1) % 4;
    var dots = new Array(i + 1).join(".");
    process.stdout.write("Sniffing on channel " + channels[channelIndex] + dots);
  }, 300);

  var child = spawn(require('path').join(__dirname, 'tinsSniffer'), [interfaceName]);

  child.stdout.on('data', function (data) {
    fs.appendFile(outputFile, data, function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

  child.stderr.on('data', function (err) {
    console.log(err.toString());
    fs.appendFile('error.log', err.toString());
  });

}


