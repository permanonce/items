import assertRevert from './helpers/assertRevert';
const BigNumber = web3.BigNumber;
const ItemDeed = artifacts.require('ItemDeed.sol');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('ItemDeed', accounts => {
  let deed = null;
  const _unknownDeedId = 999;

  const _creator = accounts[0];
  const _firstOwner = accounts[1];
  const _secondOwner = accounts[2];
  const _thirdOwner = accounts[3];
  const _unrelatedAddr = accounts[4];

  const _serialNumber1 = "WSBC973528365"
  const _serialNumber2 = "M1024"
  const _serialNumber3 = "LTS7300927"
  const _deletedSerialNumber = "LTS4530957"

  const _manufacturer1 = "S25"; //"Specialized";
  const _manufacturer2 = "M20"; //"Moots Cycles";
  const _manufacturer3 = "S02"; //"Santa Cruz Bicycles";

  const _description1 = "this is a thingy";
  const _description2 = "this is a thingy too";
  const _description3 = "this is also a thingy";
  const _description4 = "this is also a thingy too";


  const _deedUrl = "http://ipfs.io/ipfs/";

  const _ipfsImage1 = "QmTsx8byxDXaZV5pcNsaoctctibJqm5H3jmZ6XeSgH2RRD";
  const _ipfsImage2 = "QmPB7wCgU35yt2uJ1ynsEYM9jQxLnYDAPEjpZoVWCV7yqj";
  const _ipfsImage3 = "QmcY3N16r4GSNkgJPJiQjKxYVTrB27yzqPAgVonqVpMq5r";
  const _ipfsImage4 = "QmeJ7qTAuViHztHs1RqGHvAgRtnJwQfEu1Kjt5hWbPJVfj";

  const _ipfsVideo1 = "QmeJ7qTAuViHztHs1RqGHvAgRtnJwQfEu1Kjt5hWbPJVfj";
  const _ipfsVideo2 = "QmcY3N16r4GSNkgJPJiQjKxYVTrB27yzqPAgVonqVpMq5r";
  const _ipfsVideo3 = "QmPB7wCgU35yt2uJ1ynsEYM9jQxLnYDAPEjpZoVWCV7yqj";
  const _ipfsVideo4 = "QmTsx8byxDXaZV5pcNsaoctctibJqm5H3jmZ6XeSgH2RRD";

  const _valueMsrp1 = "100000";
  const _valueMsrp2 = "3040000";
  const _valueMsrp3 = "5040000";
  const _valueMsrp4 = "63400000";

  const _valueSold1 = "100001";
  const _valueSold2 = "3040001";
  const _valueSold3 = "5040001";
  const _valueSold4 = "63400001";

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  const date = 483235200;
  beforeEach(async function () {
    deed = await ItemDeed.new({ from: _creator });
    deed.setUrl(_deedUrl);
    await deed.create(_firstOwner, false, _serialNumber1, _manufacturer1, _description1, _ipfsImage1, _ipfsVideo1, _valueMsrp1, _valueSold1, date);
    await deed.create(_secondOwner, true, _serialNumber2, _manufacturer2, _description2, _ipfsImage2, _ipfsVideo2, _valueMsrp2, _valueSold2, date);
    await deed.create(_secondOwner, true, _serialNumber3, _manufacturer3, _description3, _ipfsImage3, _ipfsVideo3, _valueMsrp3, _valueSold3, date);
    await deed.create(_creator, false, _deletedSerialNumber, _manufacturer3, _description4, _ipfsImage4, _ipfsVideo4, _valueMsrp4, _valueSold4, date);
  });

  describe('verify', function () {

    describe('verifyOwnerOf', function () {
      it('verify deed creation', async function () {
        let owner1 = await deed.ownerOf(0);
        assert.equal(owner1, _firstOwner);
        let owner2 = await deed.ownerOf(1);
        assert.equal(owner2, _secondOwner);
        let owner3 = await deed.ownerOf(2);
        assert.equal(owner3, _secondOwner);
        });
      });

    describe('verifyIpfsImage', function () {
      it('verify ipfsImage existence', async function () {
        let ipfs1 = await deed.deedUri(0);
        assert.equal(ipfs1, (_deedUrl + _ipfsImage1));

        // verify that there is 1 ipfs image
        let ipfsDocumentCount = await deed.getIpfsDocumentCount(0);
        assert.equal(ipfsDocumentCount, 2);

        // add another ipfs document and verify that the count is 2
        await deed.addIpfsDocument(0, _ipfsImage2);
        ipfsDocumentCount = await deed.getIpfsDocumentCount(0);
        assert.equal(ipfsDocumentCount, 3);

        let ipfs2 = await deed.deedUri(1);
        assert.equal(ipfs2, (_deedUrl + _ipfsImage2));
        let ipfs3 = await deed.deedUri(2);
        assert.equal(ipfs3, (_deedUrl + _ipfsImage3));
        });
      });

    describe('verifyCount', function () {
      it('verify count of deeds by owner', async function () {
        let count = await deed.countOfDeedsByOwner(_secondOwner);
        assert.equal(count, 2, 'test failed');
        });
      });

    describe('verifyNames', function () {
      it('verify name of deeds', async function () {
        let name1 = await deed.deedName(0);
        assert.equal(name1, (_serialNumber1 + _manufacturer1));
        let name2 = await deed.deedName(1);
        assert.equal(name2, (_serialNumber2 + _manufacturer2));
        let name3 = await deed.deedName(2);
        assert.equal(name3, (_serialNumber3 + _manufacturer3));
        });
      });
    });

  describe('destroy', function () {
    describe('when the given id exists', function () {
      it('marks the deed as deleted', async function () {
        let countOfDeeds = await deed.countOfDeeds();
        countOfDeeds.should.be.bignumber.equal(4);
        let count = await  deed.countOfDeedsByOwner(_creator);
        let deedId = await deed.deedOfOwnerByIndex(_creator, --count);
        await deed.destroy(deedId);
        countOfDeeds = await deed.countOfDeeds();
        countOfDeeds.should.be.bignumber.equal(3);
      });
    });

    describe('when the given id does not exist', function () {
      it('reverts', async function () {
        await assertRevert(deed.destroy(_unknownDeedId));
      });
    });
  });

});
