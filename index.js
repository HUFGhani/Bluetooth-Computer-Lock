const noble = require('noble');
const cliselect = require("list-selector-cli");

const RSSI_THRESHOLD    = -65;
let inRange = [];

start();


function start() {
    noble.on('stateChange', function(state) {
        if (state === 'poweredOn') {
            noble.startScanning([], true);
            discover();
        } else {
            noble.stopScanning();
        }
    });
}

function discover() {
    noble.on('discover', function(peripheral) {
        if (peripheral.rssi < RSSI_THRESHOLD) {
            // ignore
            return;
        }

        var id = peripheral.id;
        var entered = !inRange[id];

        if (entered) {
            inRange[id] = {
                peripheral: peripheral
            };

            console.log('"' + peripheral.advertisement.localName + '" entered (RSSI ' + peripheral.rssi + ') ' + new Date());
            console.log(id);
        }

        inRange[id].lastSeen = Date.now();
    });
}
