bitcoin.pubkeysToMultisig = function(M, pubkeys, network) {
    var r = {};
    r.redeemScript = bitcoin.scripts.multisigOutput(M, pubkeys);
    r.scriptPubKey = bitcoin.scripts.scriptHashOutput(r.redeemScript.getHash());
    r.address = bitcoin.Address.fromOutputScript(r.scriptPubKey, network).toString();
    return r;
}

bitcoin.networks.shadow = {
  magicPrefix: '\x19ShadowCash Signed Message:\n',
  bip32: {
    public: 0xEE80286A,
    private: 0xEE8031E8
  },
  pubKeyHash: 0x3f,
  scriptHash: 0x7d,
  wif: 0xbf,
  dustThreshold: 0,
  feePerKb: 1000,
  estimateFee: function() { return "unused in this app" },
};

bitcoin.networks.shadowtn = {
  magicPrefix: '\x19ShadowCash Signed Message:\n',
  bip32: {
    public: 0x76C0FDFB,
    private: 0x76C1077A
  },
  pubKeyHash: 0x7f,
  scriptHash: 0xc4,
  wif: 0xff,
  dustThreshold: 0,
  feePerKb: 1000,
  estimateFee: function() { return "unused in this app" },
};

bitcoin.networks.dash = {
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  pubKeyHash: 0x4c,
  scriptHash: 0x10,
  wif: 0xcc,
};

bitcoin.networks.game = {
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  pubKeyHash: 0x26,
  scriptHash: 0x05,
  wif: 0xa6,
};
