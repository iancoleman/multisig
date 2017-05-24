Discover = function(options) {

    var orderings = options.orderings || [];
    var onDiscover = options.onDiscover || function(el){};
    var onComplete = options.onComplete || function(){};
    var onStop = options.onStop || function(){};
    var onError = options.onError || function(el){};
    var network = options.network || bitcoin.networks.bitcoin;

    var scrapeRate = 1000; // ms between checks to avoid rate limiting

    var continueDiscovering = true;

    this.stop = function() {
        onStop();
        continueDiscovering = false;
    }

    function start() {
        checkAddressForOrderIndex(0, 0);
    }

    function checkAddressForOrderIndex(i, m) {
        // stop if needed
        if (!continueDiscovering) {
            return;
        }
        // get address
        var ordering = orderings[i];
        var n = ordering.length;
        var orderingText = ordering.map(function(p) { return p.indexChar }).join("");
        var pubkeys = ordering.map(function(o) { return o.pubkey });
        // check address
        var multisig = bitcoin.pubkeysToMultisig(m, pubkeys, network);
        var address = multisig.address;
        var elText = orderingText + " : " + m + " of " + n + " : " + address;
        checkAddressForUsage(address, function(d) {
            var hasBeenUsed = d.txApperances && d.txApperances > 0;
            // show result
            var el = $("<div>");
            el.text(elText);
            if (hasBeenUsed) {
                el.addClass("text-success");
            }
            else {
                el.addClass("text-danger strikethrough");
            }
            if (continueDiscovering) {
                onDiscover(el);
            }
        }, function(e) {
            // show error
            var el = $("<div class='text-danger'>");
            // TODO be more specific with text here
            el.text(elText + " unknown error");
            if (continueDiscovering) {
                onError(el);
            }
        }, function() {
            // move onto the next address
            var nextI = i;
            var nextM = m + 1;
            if (nextM > n) {
                nextM = 0;
                nextI = i + 1;
            }
            if (nextI >= orderings.length) {
                if (continueDiscovering) {
                    onComplete();
                }
                return;
            } else {
                setTimeout(function() {
                    checkAddressForOrderIndex(nextI, nextM);
                }, scrapeRate);
            }
        });
    }

    function checkAddressForUsage(address, onSuccess, onError, onComplete) {
        $.ajax({
            url: "https://insight.bitpay.com/api/addr/" + address + "/?noTxList=1",
            success: onSuccess,
            error: onError,
            complete: onComplete,
        });
    }

    start();

}
