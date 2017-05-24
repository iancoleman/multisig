(function() {

    var self = this;

    var showQr = false;
    var network = bitcoin.networks.bitcoin;
    var parts = [];
    var orderings = [];
    var discoveryProcesses = [];

    var DOM = {};
    DOM.feedback = $(".feedback");
    DOM.parts = $(".parts");
    DOM.network = $("#network");
    DOM.qrContainer = $(".qr-container");
    DOM.qrHider = DOM.qrContainer.find(".qr-hider");
    DOM.qrImage = DOM.qrContainer.find(".qr-image");
    DOM.qrHint = DOM.qrContainer.find(".qr-hint");
    DOM.showQrEls = $("[data-show-qr]");
    DOM.partList = $(".part-list");
    DOM.participantsCount = $(".participants-count");
    DOM.signatoriesCount = $(".signatories-count");
    DOM.partOrder = $(".part-order");
    DOM.address = $(".address");
    DOM.pubkeyScript = $(".pubkey-script");
    DOM.redeemScript = $(".redeem-script");
    DOM.discover = $(".discover");
    DOM.discovered = $(".discovered");
    DOM.discoverInProgress = $(".discover-in-progress");

    function init() {
        // Events
        DOM.parts.on("input", partsChanged);
        DOM.network.on("change", networkChanged);
        DOM.signatoriesCount.on("change", detailsChanged);
        DOM.partOrder.on("change", detailsChanged);
        DOM.discover.on("click", discoverClicked);
        setQrEvents(DOM.showQrEls);
        hideFeedback();
        populateNetworkSelect();
    }

    // Event handlers

    function partsChanged(e) {
        clearDom();
        stopExistingDiscoveries();
        var partsStr = DOM.parts.val();
        parts = partsFromString(partsStr);
        if (parts.length == 0) {
            return;
        }
        orderings = orderingsFromParts(parts);
        displayPartList();
        setDetails();
        detailsChanged();
    }

    function detailsChanged() {
        var orderIndex = parseInt(DOM.partOrder.val());
        var ordering = orderings[orderIndex];
        var pubKeys = ordering.map(function(o) { return o.pubkey });
        var M = parseInt(DOM.signatoriesCount.val());
        var multisig = bitcoin.pubkeysToMultisig(M, pubKeys, network);
        DOM.redeemScript.text(multisig.redeemScript.toHex());
        DOM.pubkeyScript.val(multisig.scriptPubKey.toHex());
        DOM.address.val(multisig.address);
    }

    function networkChanged(e) {
        var networkIndex = e.target.value;
        networks[networkIndex].onSelect();
        detailsChanged();
    }

    function discoverClicked() {
        stopExistingDiscoveries();
        clearDisplayedDiscoveries();
        discoverUsedAddresses();
    }

    // Private methods

    function setDetails() {
        // N
        var N = parts.length;
        DOM.participantsCount.text(N);
        // M
        DOM.signatoriesCount.empty();
        for (var i=0; i<=parts.length; i++) {
            var option =$("<option>");
            option.attr("value", i);
            option.text(i);
            DOM.signatoriesCount.append(option);
        }
        var M = initialSignatoryCount(N);
        DOM.signatoriesCount.val(M);
        // Ordering
        DOM.partOrder.empty();
        for (var i=0; i<orderings.length; i++) {
            var ordering = orderings[i];
            var option = $("<option>");
            option.attr("value", i);
            var optionText = ordering.map(function(p) { return p.indexChar }).join("");
            option.text(optionText);
            DOM.partOrder.append(option);
        }
    }

    function stopExistingDiscoveries() {
        while (discoveryProcesses.length > 0) {
            var p = discoveryProcesses.shift();
            p.stop();
        }
    }

    function clearDisplayedDiscoveries() {
        DOM.discovered.empty();
    }

    function discoverUsedAddresses() {
        if (orderings.length == 0) {
            return;
        }
        showDiscoverInProgress();
        var p = new Discover({
            orderings: orderings,
            onDiscover: displayDiscovery,
            onComplete: discoverComplete,
            onStop: discoverStopped,
            onError: discoverError,
            network: network,
        });
        discoveryProcesses.push(p);
    }

    function displayDiscovery(el) {
        DOM.discovered.append(el);
    }

    function discoverComplete() {
        hideDiscoverInProgress();
    }

    function discoverStopped() {
        hideDiscoverInProgress();
    }

    function discoverError(msg) {
        var el = $("<div class='text-danger'>");
        el.text(msg);
        DOM.discovered.append(el);
    }

    function showDiscoverInProgress() {
        DOM.discoverInProgress.removeClass("hidden");
    }

    function hideDiscoverInProgress() {
        DOM.discoverInProgress.addClass("hidden");
    }

    function partsFromString(s) {
        var parts = [];
        // filter valid parts
        var bits = s.split(/\W+/g);
        for (var i=0; i<bits.length; i++) {
            var bit = bits[i];
            var part = new Part(bit, parts.length);
            if (part.isValid) {
                parts.push(part);
            }
        }
        return parts;
    }

    function displayPartList() {
        DOM.partList.empty();
        if (parts.length == 0) {
            DOM.partList.append($("<tr><td>No valid parts</td></tr>"));
        }
        for (var i=0; i<parts.length; i++) {
            var part = parts[i];
            DOM.partList.append(part.tableRow);
        }
    }

    function hideFeedback() {
        DOM.feedback
            .text("")
            .hide();
    }

    function populateNetworkSelect() {
        for (var i=0; i<networks.length; i++) {
            var network = networks[i];
            var option = $("<option>");
            option.attr("value", i);
            option.text(network.name);
            DOM.network.append(option);
        }
    }

    function setQrEvents(els) {
        els.on("mouseenter", createQr);
        els.on("mouseleave", destroyQr);
        els.on("click", toggleQr);
    }

    function createQr(e) {
        var content = e.target.textContent || e.target.value;
        if (content) {
            var size = 130;
            DOM.qrImage.qrcode({width: size, height: size, text: content});
            if (!showQr) {
                DOM.qrHider.addClass("hidden");
            }
            else {
                DOM.qrHider.removeClass("hidden");
            }
            DOM.qrContainer.removeClass("hidden");
        }
    }

    function destroyQr() {
        DOM.qrImage.text("");
        DOM.qrContainer.addClass("hidden");
    }

    function toggleQr() {
        showQr = !showQr;
        DOM.qrHider.toggleClass("hidden");
        DOM.qrHint.toggleClass("hidden");
    }

    // https://stackoverflow.com/a/20871714
    function orderingsFromParts(inputArr) {
        var results = [];
        function permute(arr, memo) {
            var cur, memo = memo || [];
            for (var i = 0; i < arr.length; i++) {
                cur = arr.splice(i, 1);
                if (arr.length === 0) {
                    results.push(memo.concat(cur));
                }
                permute(arr.slice(), memo.concat(cur));
                arr.splice(i, 0, cur[0]);
            }
            return results;
        }
        return permute(inputArr);
    }

    function initialSignatoryCount(n) {
        return Math.ceil(n/2);
    }

    function clearDom() {
        parts = [];
        orderings = [];
        DOM.partList.empty();
        DOM.discovered.empty();
        hideDiscoverInProgress();
        DOM.participantsCount.text("N");
        DOM.signatoriesCount.empty().append($("<option>M</option>"));
        DOM.partOrder.empty();
        DOM.address.val("");
        DOM.pubkeyScript.val("");
        DOM.redeemScript.text("");
    }

    var networks = [
        {
            name: "Bitcoin",
            onSelect: function() {
                network = bitcoin.networks.bitcoin;
            },
        },
        {
            name: "Bitcoin Testnet",
            onSelect: function() {
                network = bitcoin.networks.testnet;
            },
        },
        {
            name: "Dogecoin",
            onSelect: function() {
                network = bitcoin.networks.dogecoin;
            },
        },
        {
            name: "DASH",
            onSelect: function() {
                network = bitcoin.networks.dash;
            },
        },
        {
            name: "GAME",
            onSelect: function() {
                network = bitcoin.networks.game;
            },
        },
        {
            name: "Jumbucks",
            onSelect: function() {
                network = bitcoin.networks.jumbucks;
            },
        },
        {
            name: "Litecoin",
            onSelect: function() {
                network = bitcoin.networks.litecoin;
            },
        },
        {
            name: "ShadowCash",
            onSelect: function() {
                network = bitcoin.networks.shadow;
            },
        },
        {
            name: "ShadowCash Testnet",
            onSelect: function() {
                network = bitcoin.networks.shadowtn;
            },
        },
        {
            name: "Viacoin",
            onSelect: function() {
                network = bitcoin.networks.viacoin;
            },
        },
        {
            name: "Viacoin Testnet",
            onSelect: function() {
                network = bitcoin.networks.viacointestnet;
            },
        },
    ]

    init();

})();
