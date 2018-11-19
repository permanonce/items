var express = require('express');
var router = express.Router();
var items = require('../lib/items.js');

router.get('/', async function(req, res, next) {
  items.setContractAddress(req.app.get('contractAddress'));
  items.setWeb3Provider(req.app.get('web3Provider'));
  res.render('items', { items: await items.getItems() });
});

/* GET items page. */
router.get('/:deedid', async function(req, res, next) {
  var deedid = req.params.deedid;
  items.setContractAddress(req.app.get('contractAddress'));
  items.setWeb3Provider(req.app.get('web3Provider'));
  console.log("deedid: " + deedid);
  if (deedid == '' || deedid === undefined) {
    res.render('items', { items: await items.getItems() });
  }
  else {
    var format = req.query.format;
    if (!format) {
      res.render('item', { item: await items.getItem(deedid) });
    }
    else {
      res.render('item', { item: await items.getItem(deedid) });
    }
  }
});

module.exports = router;
