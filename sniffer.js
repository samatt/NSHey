var spawn = require('child_process').spawn;
var fs = require('fs');
var network = require('network');

var channelIndex = 0;
var channelHopper;
var currentChannel;
var hopTimer;
var tinsSniffer;

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

  hopTimer = setTimeout(hop, 10000, channels);
};

var sniff = function(interfaceName, callback) {

  tinsSniffer = spawn(require('path').join(__dirname, 'tinsSniffer'), [interfaceName]);

  tinsSniffer.stdout.on('data', function (data) {
    if (typeof callback === 'function') {
      callback(data);
    } else {
      console.log(data);
    }
  });

  tinsSniffer.stderr.on('data', function (err) {
    console.log(err.toString());
    //fs.appendFile('error.log', err.toString());
  });
}

var stop = function() {
  try {
    tinsSniffer.kill();
    channelHopper.kill();
    clearTimeout(hopTimer);
  } catch(e) {
    console.log('Error shutting down');
  }
};

var getInterface = function(cb) {
  network.get_active_interface(function(err, obj) {
    cb(obj);
  });
}

var getCurrentChannel = function() {
  return currentChannel;
}

module.exports.sniff = sniff;
module.exports.hop = hop;
module.exports.stop = stop;
module.exports.getInterface = getInterface;
module.exports.getCurrentChannel = getCurrentChannel;

