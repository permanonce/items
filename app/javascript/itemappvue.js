// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import Vue from './vue'
import itemmanufacturersfromfile from './itemmanufacturers.json'
import VModal from 'vue-js-modal'

Vue.use(VModal, { dynamic: true })
//import Modal from '../Modal.vue'

var ItemDeed = contract(require('../../build/contracts/ItemDeed.json'));
var Buffer = require('buffer/').Buffer;

const ITEMDEED_ITEMS_URL = "https://permanonce.io/items/";
const ITEMDEED_IPFS_URL = "https://permanonce.io/ipfs/";

window.app = app;

// register modal component
Vue.component('modal', {
  template: '#modal-details-template',
  methods: {
    emit: function() {
			this.$emit('event_child', 1)
		}
  },
  mounted: function() {
    app.displayQRCode();
  }
});

// register modal component
Vue.component('modal2', {
  template: '#modal-my-details-template',
  methods: {
    emit: function() {
			this.$emit('event_child', 1)
		}
  },
  mounted: function() {
    app.displayQRCode();
  }
});

var app = new Vue({
      el: '#app',
      data: {
        // Ropsten address???
        //contractAddress: '0x83f306d638daeedc8895ba5ae6dc6e173195e056',
        // Old Ropsten Address
        //contractAddress: '0xdeEe03988C64C3aa4fcFe36896c4272ACF490a33',
        // Mainnet
        //contractAddress: '0xa7aB6FcA68f407BB5258556af221dE9d8D1A94B5',
        // Ganache Address???
        contractAddress: "0x0326f2995b5defb4c06cff408cad8328423c6947",
        userAccount: '',
        nametag: '',
        status: '',
        message: '',
        allitems: [],
        myitems: [],
        singleItem: '',
        itemlist: [],
        manufacturers: [],
        web3Enabled: false,
        web3Injected: false,
        networkLabel: '',
        // display controls
        search: '',
        showDetailsModal: false,
        showMyDetailsModal: false,
        itemManufacturerSelected: false,
        pooFileLoaded: false,
        pooFileSelected: false,
        displayRegistrationComponents: true,
        showSpinner: false,
        showUploadSpinner: false,
        // specific item details
        itemOwner: '',
        itemSerialNumber: '',
        itemId: '',
        itemManufacturer: '000', // default
        itemIpfsHash: '',
        itemDateCreated: '',
        itemUrl: '',
        // miscellaneous
        newOwnerAddress: '',
        processingMessage: ''
      },
      beforeCreate: function () {
        console.log("beforeCreate...");
      },
      created: function () {
        console.log("created...");
      },
      beforeMount: function () {
        console.log("beforeMount...");
      },
      mounted:function(){
        console.log("mounted...");

        var accountInterval = setInterval(function() {
          if (this.web3Injected == true) {
            if (web3.eth.accounts[0] !== this.userAccount) {
              this.userAccount = web3.eth.accounts[0];
              updateInterface();
            }
          }
        }, 500);

        this.initWeb3();
        if (this.web3Enabled == true) {
          this.initAccounts();
          this.initContract();
          this.loadAllItems();
          this.initManufacturers();
          //alert("performed mounted functions");
        }
      },
      beforeUpdate:function(){
        console.log("beforeUpdate...");
      },
      updated:function() {
        console.log("updated...");
      },
      activated:function() {
        console.log("activated...");
      },
      methods:{
        updateInterface:function() {
           window.location.reload(true);
        },
        loadCurrentProvider:function () {

        },
        initWeb3:function() {
          // Checking if Web3 has been injected by the browser (Mist/MetaMask)
          let self = this;
          if (typeof web3 !== 'undefined') {
            console.warn("Using injected web3")
            this.web3Injected = true;
            // Use Mist/MetaMask's provider
            window.web3 = new Web3(web3.currentProvider);
          } else {
            console.warn("No injected web3 detected, using infura.");
            window.web3 = new Web3(
              new Web3.providers.HttpProvider('https://mainnet.infura.io/uHJFDlXprJ52gu4uK9oA')
            );
          }
          var networkId = web3.version.network;
          console.log('networkId: ' + networkId);

          switch (networkId) {
          case "1":
            this.networkLabel = "";
            break;
          case "2":
            this.networkLabel = "You are on the Morden Network - Please switch to Mainnet";
            break;
          case "3":
            this.networkLabel = "You are on the Ropsten Network - Please switch to Mainnet";
            break;
          case "4":
            this.networkLabel = "You are on the Rinkeby Network - Please switch to Mainnet";
            break;
          case "42":
            this.networkLabel = "You are on the Kovan Network - Please switch to Mainnet";
            break;
          default:
            this.networkLabel = "";
          }
          this.web3Enabled = true;
        },
        initAccounts:function(){
          let self = this;
          ItemDeed.setProvider(web3.currentProvider);
          this.userAccount = web3.eth.accounts[0];
        },
        initContract:function(){
          let self = this;
          const loadContract = async () => {
            let deed = await ItemDeed.at(this.contractAddress);
            let name = await deed.name();
            this.nametag = name;
          }
          loadContract();
        },
        isMobile:function() {
          var userAgent = window.navigator.userAgent,
          platform = window.navigator.platform,
          macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
          windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
          iosPlatforms = ['iPhone', 'iPad', 'iPod'],
          os = null;

          if (macosPlatforms.indexOf(platform) !== -1) {
            return false;
          } else if (iosPlatforms.indexOf(platform) !== -1) {
            return true;
          } else if (windowsPlatforms.indexOf(platform) !== -1) {
            return false;
          } else if (/Android/.test(userAgent)) {
            return true;
          } else if (!os && /Linux/.test(platform)) {
            return false;
          }
          return false;
        },
        loadItemWithId: async function(deedId) {
        let self = this;
        const loadItem = async (deedId) => {
          let deed = await ItemDeed.at(this.contractAddress);

          const FIELD_SERIAL_NUMBER = 0
          const FIELD_MANUFACTURER = 1
          const FIELD_IPFS_HASH = 2
          const FIELD_DATE_CREATED = 3
          const FIELD_DATE_DELETED = 4

          var itemDeed = await deed.deeds(deedId);
          try {
            var itemOwner = await deed.ownerOf(deedId);
          } catch(error) {
            // probably a deleted token and therefore has no owner.
            console.log(error);
            return error;
          }
          var url = await deed.deedUri(deedId);
          const item = {
            id: deedId,
            serialNumber: itemDeed[FIELD_SERIAL_NUMBER],
            manufacturer: itemDeed[FIELD_MANUFACTURER],
            ipfsHash: itemDeed[FIELD_IPFS_HASH],
            dateCreated: itemDeed[FIELD_DATE_CREATED],
            dateDeleted: itemDeed[FIELD_DATE_DELETED],
            owner: itemOwner,
            itemUrl: url
          }
          // HACK ALERT
          item.itemUrl = ITEMDEED_IPFS_URL + item.ipfsHash;
          this.singleItem = item;
        }
        await loadItem(deedId);
      },
      loadAllItems: function() {
        let self = this;
        this.allitems.length=0;
        const loadItems = async () => {
          let deed = await ItemDeed.at(this.contractAddress);
          let deedIds = await deed.ids();

          const FIELD_SERIAL_NUMBER = 0
          const FIELD_MANUFACTURER = 1
          const FIELD_IPFS_HASH = 2
          const FIELD_DATE_CREATED = 3
          const FIELD_DATE_DELETED = 4

          for (let i = 0; i < deedIds.length; i++) {
            var deedId = deedIds[i];
            var itemDeed = await deed.deeds(deedId);
            try {
              var itemOwner = await deed.ownerOf(deedId);
            } catch(error) {
              // probably a deleted token and therefore has no owner.
              continue;
            }
            var url = await deed.deedUri(deedId);
            const item = {
              id: deedId,
              serialNumber: itemDeed[FIELD_SERIAL_NUMBER],
              manufacturer: itemDeed[FIELD_MANUFACTURER],
              ipfsHash: itemDeed[FIELD_IPFS_HASH],
              dateCreated: itemDeed[FIELD_DATE_CREATED],
              dateDeleted: itemDeed[FIELD_DATE_DELETED],
              owner: itemOwner,
              itemUrl: url
            }
            // HACK ALERT
            item.itemUrl = ITEMDEED_IPFS_URL + item.ipfsHash;
            if (web3.isAddress(itemOwner)) {
              this.allitems.push(item);
            }
          }
        }
        loadItems();
        this.itemlist = this.allitems;
      },
      lookupManufacturerLabel: function (value1) {
        var i;
        for (i = 0; i < this.manufacturers.length; i++) {
          var value2 = this.manufacturers[i].value;
          if (value1.trim() == value2.trim()) {
            return this.manufacturers[i].text;
          }
        }
        return value1;
      },
      itemLabel: function (item) {
        var i;
        for (i = 0; i < this.manufacturers.length; i++) {
          var value1 = item.manufacturer;
          var value2 = this.manufacturers[i].value;
          if (value1.trim() == value2.trim()) {
            return this.manufacturers[i].text;
          }
        }
        return value1;
      },
      initManufacturers: function() {
         this.manufacturers = itemmanufacturersfromfile;
      },
      showMyItems:function() {
        this.initAccounts();
        this.myitems.length = 0;
        for (let index = 0; index < this.allitems.length; ++index) {
          let item = this.allitems[index];
          if (item.owner == this.userAccount) {
            this.myitems.push(item);
          }
        }
        this.itemlist = this.myitems;
      },
      showAllItems:function() {
        this.myitems.length = 0;
        this.itemlist = this.allitems;
      },
      showItemDetails:function(item) {
       // Not sure why this has to be done.
        this.initAccounts();
        this.itemId = item.id;
        this.itemOwner = item.owner;
        this.itemSerialNumber = item.serialNumber;
        this.itemManufacturer = item.manufacturer;
        this.itemIpfsHash = item.ipfsHash;
        this.itemDateCreated = new Date(item.dateCreated*1000);
        this.itemUrl = item.itemUrl;
        if (this.userAccount == item.owner) {
          this.showMyDetailsModal=true;
          this.displayRegistrationComponents=true;
          this.processingMessage = ""
        }
        else {
          this.showDetailsModal=true;
        }
     },
     displayMetaData:function() {
       window.open(this.itemUrl, "proofofownershipwindow", "location=yes,height=570,width=520,scrollbars=yes,status=yes");
     },
    displayQRCode: function() {
      var QRCode = require('qrcode');
      var opts = {
        width: 100,
        height: 100,
        errorCorrectionLevel: 'H'
      };
      var canvas = document.getElementById('canvas');
      QRCode.toCanvas(canvas, ITEMDEED_ITEMS_URL + this.itemId, opts, function (error) {
        if (error) {
          console.error(error);
        }
        console.log('success!');
      });
    },
     confirmRegistration:function() {
       this.initAccounts();
       // HACK ALERT: prepend 'S' if serialNumber does not contain a letter.
       // this is due to a bug in the contract.

       var letter = /.*[a-zA-Z].*/;
       //var letter = /^[a-zA-Z]+$/;
       if (!this.itemSerialNumber.match(letter))  {
         this.itemSerialNumber = 'S' + this.itemSerialNumber;
       }
       this.showDetailsModal = true;
     },
     deleteItemDeed: function() {
       const destroyDeed = async () => {
         var self = this;
         ItemDeed.defaults({from: this.userAccount, gas: 900000 });
         let deed = await ItemDeed.at(this.contractAddress);
         this.processingMessage = "Deleting item deed. This may take a while...";
         this.showSpinner=true;
         this.displayRegistrationComponents = false;
         this.sleep(1000);
         try {
           let result = await deed.destroy(this.itemId);
         } catch (error) {
           console.log(error.message);
           this.processingMessage = error.message;
           alert(error.message);
           this.showSpinner=false;
           this.displayRegistrationComponents = true;
           return;
         }
         this.processingMessage = "Congratulations!  Your item has been deleted!";
         this.itemOwner = this.newOwnerAddress;
         this.showSpinner=false;
         this.displayRegistrationComponents = false;
         this.initAccounts();
         this.loadAllItems();
       }

       // Not sure why this has to be done.
       this.initAccounts();

       if (!destroyDeed()) {
         return;
       }
     },
     openQRCamera: function(node) {
       var self = this;

       const getQRCode = (inputFile) => {
         var reader = new FileReader();
         return new Promise((resolve, reject) => {
           reader.onerror = () => {
           reader.abort();
           reject(new Exception("Problem reading QR Code."));
         };
         reader.onload = () => {
           node.value = "";
           qrcode.callback = function(res) {
             if(res instanceof Error) {
               alert("No QR code found. Please make sure the QR code is within the camera's frame and try again.");
             } else {
               var len = ITEMDEED_ITEMS_URL.length;
               var s1 = res.substr(0, len);
               var s2 = res.substr(len);
               if (s1 != ITEMDEED_ITEMS_URL ) {
                 alert("This is not a ItemDeed QR Code.");
                 reject(new Exception("This is not a Itemed QR Code."));
               }
               var deedId = s2;
               resolve(deedId);
             }
           }
           qrcode.decode(reader.result);
         };
         reader.readAsDataURL(inputFile);
         });
       };
       const handleQRCode = async () => {
         var self = this;
         const deedId = await getQRCode(node.qrcodeinput.files[0]);
         this.verifyOwnership(deedId);
       }

       handleQRCode();
     },
     verifyOwnership: async function(deedId) {
        var self = this;
        this.initAccounts();
        try {
          let item = await this.loadItemWithId(deedId);
          if (this.singleItem) {
	    this.showItemDetails(this.singleItem);
          }
          else {
            alert("Item with deedid " + deedId + " not found");
          }
        }
        catch(error) {
          alert(error + ": No item found for deed ID: " + deedId);
        }
     },
     transferOwnership: function() {
       const transfer = async () => {
         var self = this;
         ItemDeed.defaults({from: this.userAccount, gas: 900000 });
         let deed = await ItemDeed.at(this.contractAddress);
         this.displayRegistrationComponents=false;
         this.processingMessage = "Transferring item deed to " + this.newOwnerAddress + ". This may take a while...";
         this.showSpinner = true;
         try {
           //alert("creating Item deed with "  + this.itemSerialNumber + " " +  this.itemManufacturer + " " +  this.itemIpfsHash + " " +  this.userAccount);
           let result = await deed.transfer(this.newOwnerAddress, this.itemId);
         } catch (error) {
           console.log(error.message);
           this.processingMessage = error.message;
           alert(error.message);
           this.displayRegistrationComponents=true;
           this.showSpinner = false;
           return true;
         }
         this.processingMessage = "Congratulations!  Your item has been transferred to " + this.newOwnerAddress + "!";
         this.showSpinner = false;
         this.itemOwner = this.newOwnerAddress;
         return true;
       }

       // Not sure why this has to be done.
       this.initAccounts();

       if (!web3.isAddress(this.newOwnerAddress)) {
         var errorMsg = "Not a valid address!";
         console.log(errorMsg);
         this.processingMessage = errorMsg;
         return true;
       }

       if (!transfer()) {
         return true;
       }
     },
     registerItem: function() {
       this.showDetailsModal = false;
       //alert("registering item")
       const registerItemOnBlockchain = async () => {
         var self = this;
         ItemDeed.defaults({from: this.userAccount, gas: 900000 });
         let deed = await ItemDeed.at(this.contractAddress);
         this.processingMessage = "Registering item deed on the blockchain. This may take a while...";
         this.showSpinner = true;
         try {
           //alert("creating Item deed with "  + this.itemSerialNumber + " " +  this.itemManufacturer + " " +  this.itemIpfsHash + " " +  this.userAccount);
           let result = await deed.create(this.itemSerialNumber, this.itemManufacturer, this.itemIpfsHash, this.userAccount);
         } catch (error) {
           console.log(error.message);
           this.showSpinner = false;
           error.message = "You must be logged into MetaMask for this feature.";
           this.processingMessage = error.message;
           alert(error.message);
           return false;
         }
         this.processingMessage = "Congratulations!  Your item has been registered on the blockchain.";
         this.showSpinner = false;
         this.clearRegistrationForm();
         return true;
       }

       // Not sure why this has to be done.
       this.initAccounts();

       if (!registerItemOnBlockchain()) {
         return;
       }
     },
     displayPooExample:function() {
       window.open("poofileexample.jpg", "poofileexamplewindow", "titlebar=no,location=no,height=570,width=520,scrollbars=yes,status=no");
     },
     clearRegistrationForm:function() {
        this.pooFileSelected = false;
        this.itemManufacturer = '000';
        this.itemSerialNumber = '';
        this.itemIpfsHash = '';
        this.showDetailsModal = false;
        this.itemManufacturerSelected = false;
        this.pooFileLoaded = false;
        this.processingMessage = '';
     },
     pooFileSelectedEvent:function(event) {
        this.pooFileSelected = true;
        this.itemIpfsHash = '';
     },
     uploadFileToIpfs:function () {
        var self = this;

       // since readAsArrayBuffer does not return a Promise, do this.
       const readUploadedFileAsBuffer = (inputFile) => {
         const reader = new FileReader();
         return new Promise((resolve, reject) => {
           reader.onerror = () => {
           reader.abort();
           reject(new DOMException("Problem parsing input file."));
         };
         reader.onload = () => {
           resolve(reader.result);
         };
         reader.readAsArrayBuffer(inputFile);
         });
       };

       const uploadFile = async () => {
         const pooFile = document.getElementById("pooFile");
         const reader = new FileReader();
         const fileContents = await readUploadedFileAsBuffer(pooFile.files[0]);
         const ipfs = window.IpfsApi('itemdeed.io', 443, {protocol:'https'} ); // Connect to IPFS
         const buf = Buffer.from(fileContents); // Convert data into buffer
         this.showUploadSpinner = true;
         ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
           var self = this;
           if(err) {
             alert(err);
             console.error(err);
             this.showUploadSpinner = false;
             return;
           }
           this.itemIpfsHash = result[0].hash;
           this.itemUrl = ITEMDEED_IPFS_URL + this.itemIpfsHash;
           this.showUploadSpinner = false;
           this.pooFileLoaded = true;
        });
      }
      this.showUploadSpinner = true;
      uploadFile();
    },
    sleep:function(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    }
  },
  computed: {
    filteredItems: function() {
      return this.itemlist.filter((item) => {
        var searchString = this.search.toLowerCase();
        var label = this.itemLabel(item).toLowerCase();
        return (label.match(searchString) || item.serialNumber.toLowerCase().match(searchString));
      });
    }
  }
})
