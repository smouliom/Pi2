var accounts;
var accountID = 0;

function add()
{
var sig= signature.deployed();
  sig.initTransac(200,{from:account}).then(function(rslt){
   console.log("transac mise en place");
   console.log(rslt);
   sig.addHash(rslt,{from:account}).then(function(rslt2){
    console.log(rslt2);
   });
   // sig.addHash() a faire
 }).catch(function(e){
  console.log("erreur");
  console.log(e);
});
}

function toSign()
{
  var sig = signature.deployed();
  sig.toSign({from:account}).then(function(rslt){
console.log(rslt);

  }).catch(function(e){
    console.log("erreur");
    console.log(e);
  });
}



window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }
        accounts = accs;
    account = accounts[accountID];
  });
}
