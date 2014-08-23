#!/usr/bin/env node

var spawn = require('child_process').spawn;
var fs = require('fs');
var network = require('network');

var channels = ['1','6','11'];
var i = 0;
var channelHopper;
var outputFile = 'packets.log';

var hop = function(){
  if (channelHopper) {
    channelHopper.kill();
  }

  if (i < (channels.length-1) ){
    i++;
  } else{
    i = 0;
  }

  //console.log('switching to  channel ' + channels[i]);

  channelHopper = spawn('airport', ['sniff', channels[i]]);

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
    process.stdout.write("Sniffing" + dots);  // write text
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

if (process.argv[2]) {
  outputFile = process.argv[2];
}

network.get_active_interface(function(err, obj) {
  var interfaceName = 'en0';

  if (obj) {
    interfaceName = obj.name;
  }

  sniff(interfaceName);
  hop();
});
