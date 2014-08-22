var spawn = require('child_process').spawn;
var fs = require('fs');
var network = require('network');

var channels = ['1','6','11'];
var i = 0;
var channelHopper;// = spawn('airport', ['sniff', channels[i]]);

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

  //channelHopper.on('close', function (code) {
    //if (code !== 0) {
      //console.log('airport process exited with code ' + code);
    //}
  //});

  setTimeout(hop, 5000);
};

var sniff = function(interfaceName) {

  var child = spawn('./tinsSniffer', [interfaceName]);

  child.stdout.on('data', function (data) {
    fs.appendFile('./packets.log', data, function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

  child.stderr.on('data', function (err) {
    fs.appendFile('./error.log', err.toString());
  });

}

//sniff();
//hop();

network.get_active_interface(function(err, obj) {
  var interfaceName = 'en0';

  if (obj) {
    interfaceName = obj.name;
  }

  sniff(interfaceName);
  hop();
});
