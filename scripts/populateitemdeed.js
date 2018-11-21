module.exports = function(callback) {

var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require('truffle-contract');
var ItemDeed = contract(require('../build/contracts/ItemDeed.json'));
var web3 = new Web3(provider);

const _creator = web3.eth.accounts[0];
const _owner1 = web3.eth.accounts[1];
const _owner2 = web3.eth.accounts[2];
const _owner3 = web3.eth.accounts[3];
const _owner4 = web3.eth.accounts[4];
const _owner5 = web3.eth.accounts[5];
const _owner6 = web3.eth.accounts[6];
const _owner7 = web3.eth.accounts[7];

const _ipfsImage1 = "QmapmkuG84mVjWbLgoPWfZpJvFR1d6tQ8B8u1NnNAnb9vz";
const _ipfsImage2 = "QmTsx8byxDXaZV5pcNsaoctctibJqm5H3jmZ6XeSgH2RRD";
const _ipfsImage3 = "QmPB7wCgU35yt2uJ1ynsEYM9jQxLnYDAPEjpZoVWCV7yqj";
const _ipfsImage4 = "QmcY3N16r4GSNkgJPJiQjKxYVTrB27yzqPAgVonqVpMq5r";
const _ipfsImage5 = "QmeJ7qTAuViHztHs1RqGHvAgRtnJwQfEu1Kjt5hWbPJVfj";
const _ipfsImage6 = "QmT8CqNEbpv11hFQxjYzEzd4qRk5nCGhNTkoVeVSmz9UdW";
const _ipfsImage7 = "QmaoRCweKNLfdnv8sQz9v9fyZ3AsPCT9m2PBdWSWtHkzhM";
const _ipfsImage8 = "QmRgCm6EBtqSeCNKboZYH7NhncdpD7nKheYJR8NDX8rCqw";

const _ipfsVideo8 = "QmapmkuG84mVjWbLgoPWfZpJvFR1d6tQ8B8u1NnNAnb9vz";
const _ipfsVideo7 = "QmTsx8byxDXaZV5pcNsaoctctibJqm5H3jmZ6XeSgH2RRD";
const _ipfsVideo6 = "QmPB7wCgU35yt2uJ1ynsEYM9jQxLnYDAPEjpZoVWCV7yqj";
const _ipfsVideo5 = "QmcY3N16r4GSNkgJPJiQjKxYVTrB27yzqPAgVonqVpMq5r";
const _ipfsVideo4 = "QmeJ7qTAuViHztHs1RqGHvAgRtnJwQfEu1Kjt5hWbPJVfj";
const _ipfsVideo3 = "QmT8CqNEbpv11hFQxjYzEzd4qRk5nCGhNTkoVeVSmz9UdW";
const _ipfsVideo2 = "QmaoRCweKNLfdnv8sQz9v9fyZ3AsPCT9m2PBdWSWtHkzhM";
const _ipfsVideo1 = "QmRgCm6EBtqSeCNKboZYH7NhncdpD7nKheYJR8NDX8rCqw";

const _manufacturer1 = "S25"; //"Specialized";
const _manufacturer2 = "M20"; //"Moots Cycles";
const _manufacturer3 = "S02"; //"Santa Cruz Items";
const _manufacturer4 = "G06"; //"Giant Manufacturing";
const _manufacturer5 = "S06"; //"Schwinn Bicycle Company";
const _manufacturer6 = "B08"; //"Bianchi";
const _manufacturer7 = "B16"; //"Bohemian Bicycles"

const _serialNumber1 = "SBC973528365";
const _serialNumber2 = "M1024";
const _serialNumber3 = "LTS7300927";
const _serialNumber4 = "R76HGTEUR7";
const _serialNumber5 = "VGHR8987IHKH";
const _serialNumber6 = "98UYDGE";
const _serialNumber7 = "63U00927";

const _description1 = "this is a thingy";
const _description2 = "this is a thingy too";
const _description3 = "this is also a thingy";
const _description4 = "this is also a thingy too";
const _description5 = "this is also a thingy as well";
const _description6 = "in addition, this is also a thingy";
const _description7 = "as you should, this is also a thingy too";

const _valueMsrp1 = 1000000;
const _valueMsrp2 = 2332433434;
const _valueMsrp3 = 20923840282;
const _valueMsrp4 = 23943233;
const _valueMsrp5 = 9820394234;
const _valueMsrp6 = 1002;
const _valueMsrp7 = 1002;

const _valueSold1 = 1000001;
const _valueSold2 = 2332433435;
const _valueSold3 = 20923840283;
const _valueSold4 = 23943234;
const _valueSold5 = 9820394235;
const _valueSold6 = 1003;
const _valueSold7 = 1003;


ItemDeed.setProvider(provider);
ItemDeed.defaults({from: _creator, gas: 900000 });

const populateDeeds = async () => {
  let deed = await ItemDeed.deployed();
  let name = await deed.name();
  //var date = Math.round((new Date()).getTime() / 1000);
  var date = 483235200;
  try {
    
    // These will appear when you click the "All Items" link or when the index.html first loads.
    await deed.create(_owner1, true, _serialNumber1, _manufacturer1, _description1, _ipfsImage1, _ipfsVideo1, _valueMsrp1, _valueSold1, date);
    await deed.create(_owner2, false, _serialNumber2, _manufacturer2, _description2, _ipfsImage2, _ipfsVideo2, _valueMsrp2, _valueSold2, date);
    await deed.create(_owner3, false, _serialNumber3, _manufacturer3, _description3, _ipfsImage3, _ipfsVideo3, _valueMsrp3, _valueSold3, date);
    await deed.create(_owner4, true, _serialNumber4, _manufacturer4, _description4, _ipfsImage4, _ipfsVideo4, _valueMsrp4, _valueSold4, date);
    await deed.create(_owner5, false, _serialNumber5, _manufacturer5, _description5, _ipfsImage5, _ipfsVideo5, _valueMsrp5, _valueSold5, date);
    await deed.create(_owner6, false, _serialNumber6, _manufacturer6, _description6, _ipfsImage6, _ipfsVideo6, _valueMsrp6, _valueSold6, date);
    await deed.create(_owner7, true, _serialNumber7, _manufacturer7, _description7, _ipfsImage7, _ipfsVideo7, _valueMsrp7, _valueSold7, date);
    // Optionally add your PERSONAL item(s) here, so the "My Items" link will work.
    var someAddress = "0xbf00309c721accdf1f44f60c601b99bf2863b338";
    await deed.create(someAddress, false, "My$3r1AlnuM53R", "S25", _description1, _ipfsImage8, _ipfsVideo8, _valueMsrp1, _valueSold1, date);
    await deed.create(someAddress, false, "My$3r1AlnuM53R", "F05", _description2, _ipfsImage8, _ipfsVideo8, _valueMsrp2, _valueSold2, date);


  } catch (error) {
    console.log(error.message);
  }
}

populateDeeds();

}
