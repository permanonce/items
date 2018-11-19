
var Web3 = require('web3');
var QRCode = require('qrcode');
var contract = require('truffle-contract');
var path = require('path');
const fs = require('fs');

let myItems = [];
let myItem;

let CONTRACT_ADDRESS;
let WEB3_PROVIDER;

exports.setContractAddress = function(contractAddress) {
  CONTRACT_ADDRESS = contractAddress; 
}

exports.setWeb3Provider = function(web3Provider) {
  WEB3_PROVIDER = web3Provider; 
}

exports.getItems = async function() {
  const ItemDeed = contract(require(path.join(__dirname, '../build/contracts/ItemDeed.json')));
  var web3 = new Web3(
    new Web3.providers.HttpProvider(WEB3_PROVIDER)
  );

  myItems.length=0;
  ItemDeed.setProvider(web3.currentProvider);

  const FIELD_SERIAL_NUMBER = 0
  const FIELD_MANUFACTURER = 1
  const FIELD_IPFS_HASH = 2
  const FIELD_DATE_CREATED = 3
  const FIELD_DATE_DELETED = 4

  const deed = await ItemDeed.at(CONTRACT_ADDRESS);

  let deedIds = await deed.ids();
  for (let i = 0; i < deedIds.length; i++) {
    var deedId = deedIds[i];

    var itemDeed = await deed.deeds(deedId);
    try {
      var itemOwner = await deed.ownerOf(deedId);
    } catch(error) {
      // probably a deleted token and therefore has no owner.
      continue;
    }
    if (itemOwner == '0x') {
      // definitely deleted.
      continue;
    }

    const url = await deed.deedUri(deedId);
    const item = {
      id: deedId,
      serialNumber: itemDeed[FIELD_SERIAL_NUMBER],
      manufacturer: lookupManufacturerLabel(itemDeed[FIELD_MANUFACTURER]),
      ipfsHash: itemDeed[FIELD_IPFS_HASH],
      dateCreated: new Date(itemDeed[FIELD_DATE_CREATED]*1000),
      dateDeleted: itemDeed[FIELD_DATE_DELETED],
      owner: itemOwner,
      itemUrl: url
    }

    myItems.push(item);
  }
  return myItems;
}

function lookupManufacturerLabel(value1) {
  let rawdata = fs.readFileSync(path.join(__dirname, '../app/javascript/itemmanufacturers.json'));
  let manufacturers = JSON.parse(rawdata);
  var i;
  for (i = 0; i < manufacturers.length; i++) {
    var value2 = manufacturers[i].value;
    if (value1.trim() == value2.trim()) {
      return manufacturers[i].text;
    }
  }
  return value1;
}

exports.getItem = async function(deedId) {
  const ItemDeed = contract(require(path.join(__dirname, '../build/contracts/ItemDeed.json')));

  var web3 = new Web3(
    new Web3.providers.HttpProvider(WEB3_PROVIDER)
  );

  console.log("CONTRACT_ADDRESS: " + CONTRACT_ADDRESS);
  console.log("WEB3_PROVIDER: " + WEB3_PROVIDER);

  ItemDeed.setProvider(web3.currentProvider);

  const FIELD_SERIAL_NUMBER = 0
  const FIELD_MANUFACTURER = 1
  const FIELD_IPFS_HASH = 2
  const FIELD_DATE_CREATED = 3
  const FIELD_DATE_DELETED = 4

  const deed = await ItemDeed.at(CONTRACT_ADDRESS);

  console.log("deedId: " + deedId)

  const itemDeed = await deed.deeds(deedId);
  try {
    var itemOwner = await deed.ownerOf(deedId);
    } catch(error) {
      console.log("this is deleted deed");
  }

  const url = await deed.deedUri(deedId);

  var deedQRUrl = "https://permanonce.io/items/" + deedId;

  var opts = {
    width: 100,
    height: 100,
    errorCorrectionLevel: 'H'
  };

  var deedQRCode;
  try {
    deedQRCode = await QRCode.toDataURL(deedQRUrl, opts);
    console.log("deedQRCode: " + deedQRCode);
  }
  catch(err) {
    console.error(err)
  }

  const item = {
    id: deedId,
    serialNumber: itemDeed[FIELD_SERIAL_NUMBER],
    manufacturer: lookupManufacturerLabel(itemDeed[FIELD_MANUFACTURER]),
    ipfsHash: itemDeed[FIELD_IPFS_HASH],
    dateCreated: new Date(itemDeed[FIELD_DATE_CREATED]*1000),
    dateDeleted: itemDeed[FIELD_DATE_DELETED],
    owner: itemOwner,
    itemUrl: url,
    qrCode: deedQRCode
  }

  myItem = item;
  console.log(item);
  return myItem;
}
