module.exports = function(callback) {

var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require('truffle-contract');
var ItemDeed = contract(require('../build/contracts/ItemDeed.json'));
var web3 = new Web3(provider);

const _creator = web3.eth.accounts[0];

ItemDeed.setProvider(provider);
ItemDeed.defaults({from: _creator, gas: 900000 });

const displayItems = async () => {
  let deed = await ItemDeed.deployed();
  let deedIds = await deed.ids();

  const FIELD_SERIAL_NUMBER = 0
  const FIELD_MANUFACTURER = 1
  const FIELD_IPFS_HASH = 2
  const FIELD_DATE_CREATED = 3
  const FIELD_DATE_DELETED = 4

  let itemStructs = []
  for (let i = 0; i < deedIds.length; i++) {
    var deedId = deedIds[i];
    var itemDeed = await deed.deeds(deedId);
    const item = {
        name:  itemDeed[FIELD_SERIAL_NUMBER] + itemDeed[FIELD_MANUFACTURER],
        serialNumber: itemDeed[FIELD_SERIAL_NUMBER],
        manufacturer: itemDeed[FIELD_MANUFACTURER],
        ipfsHash: itemDeed[FIELD_IPFS_HASH],
        dateCreated: itemDeed[FIELD_DATE_CREATED],
        dateDeleted: itemDeed[FIELD_DATE_DELETED]
    }
    itemStructs.push(item)
  }

  console.log('itemStructs =', itemStructs)

}

displayItems();

}
