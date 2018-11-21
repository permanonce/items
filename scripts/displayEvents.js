module.exports = function(callback) {

var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require('truffle-contract');
var ItemDeed = contract(require('../build/contracts/ItemDeed.json'));
var web3 = new Web3(provider);

const _creator = web3.eth.accounts[0];

ItemDeed.setProvider(provider);
ItemDeed.defaults({from: _creator, gas: 900000 });

const displayEvents = async () => {
  let deed = await ItemDeed.deployed();
  //let events = await deed.Creation({ id: 3}, {fromBlock: 0, toBlock: 'latest'});
  let events = await deed.Creation({ }, {fromBlock: 0, toBlock: 'latest'});
  console.log('events: ' + JSON.stringify(events));
  events.get(function(error, logs) { 
    if (error) {
    console.log('Error in myEvent event handler: ' + error);
    }
    else {
      for (let i = 0; i < logs.length; i++) {
        console.log('myEvent: ' + JSON.stringify(logs[i]));
      }
    }
  });
}

displayEvents();

}
