// Converts a string into part of a multisig key
Part = function(s, i) {

    var self = this;

    this.prvkey = null;
    this.pubkey = null;

    this.isValid = validate(s);
    this.tableRow = $("<tr>");

    // set index in table row
    this.indexChar = String.fromCharCode(65+i);
    var indexCell = $("<td>").text(self.indexChar);
    self.tableRow.append(indexCell);

    // set string cell in table row
    var stringCell = $("<td>").text(s);
    self.tableRow.append(stringCell);

    // checks the part can be a part of a multisig key
    function validate(s) {
        // check hex public key
        try {
            self.pubkey = bitcoin.ECPubKey.fromHex(s);
            return true;
        }
        catch(e) {}
        // check WIF private key
        try {
            self.prvkey = bitcoin.ECKey.fromWIF(s);
            self.pubkey = self.prvkey.pub;
            return true;
        }
        catch(e) {}
        return false;
    }
}
