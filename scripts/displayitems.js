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

  const FIELD_IS_UNIQUE = 0;
  const FIELD_SERIAL_NUMBER = 1
  const FIELD_MANUFACTURER = 2
  const FIELD_DESCRIPTION = 3
  const FIELD_IPFS_IMAGE = 4
  const FIELD_IPFS_VIDEO = 5
  const FIELD_VALUE_MSRP = 6
  const FIELD_VALUE_SOLD = 7
  const FIELD_DATE_PRODUCED = 8
  const FIELD_DATE_DELETED = 9

  let itemStructs = []
  for (let i = 0; i < deedIds.length; i++) {
    var deedId = deedIds[i];
    var itemDeed = await deed.deeds(deedId);

    const item = {
        isUnique: itemDeed[FIELD_IS_UNIQUE],
        name:  itemDeed[FIELD_SERIAL_NUMBER] + itemDeed[FIELD_MANUFACTURER],
        serialNumber: itemDeed[FIELD_SERIAL_NUMBER],
        manufacturer: itemDeed[FIELD_MANUFACTURER],
        description: itemDeed[FIELD_DESCRIPTION],
        ipfsImage: itemDeed[FIELD_IPFS_IMAGE],
        ipfsVideo: itemDeed[FIELD_IPFS_VIDEO],
        valueMsrp: itemDeed[FIELD_VALUE_MSRP].toNumber(),
        valueSold: itemDeed[FIELD_VALUE_SOLD].toNumber(),
        dateProduced: new Date(itemDeed[FIELD_DATE_PRODUCED]*1000),
        dateDeleted: new Date(itemDeed[FIELD_DATE_DELETED]*1000)
    }
    itemStructs.push(item)
  }

  console.log('itemStructs =', itemStructs)

}

displayItems();


}