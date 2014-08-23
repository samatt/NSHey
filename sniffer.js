var spawn = require('child_process').spawn;
var fs = require('fs');
var network = require('network');

var channelIndex = 0;
var channelHopper;
var currentChannel;

var hop = function(channels) {
  if (channelHopper) {
    channelHopper.kill();
  }

  if (channelIndex < (channels.length-1) ){
    channelIndex ++;
  } else{
    channelIndex = 0;
  }

  currentChannel = channels[channelIndex];

  channelHopper = spawn('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport', ['sniff', currentChannel]);

  channelHopper.stdout.on('data', function (data) {
    console.log('airport stdout: ' + data);
  });

  channelHopper.stderr.on('data', function (data) {
    console.log('airport stderr: ' + data);
  });

  setTimeout(hop, 10000, channels);
};

var sniff = function(interfaceName, outputFile) {
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
    process.stdout.write("Sniffing on channel " + currentChannel + dots);
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

var getInterface = function(cb) {
  network.get_active_interface(function(err, obj) {
    cb(obj);
  });
}

module.exports.sniff = sniff;
module.exports.hop = hop;
module.exports.getInterface = getInterface;

