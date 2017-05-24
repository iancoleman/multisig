# Multisig Tool

A tool for creating multisig addresses and transactions.

## Online Version

https://iancoleman.github.io/multisig/

## Standalone offline version

Download `multisig-standalone.html`

Open the file in a browser by double clicking it.

This can be compiled from source using the command `python compile.py`

## Usage

Enter your public / private keys into the field.

Click 'discover used combos' if required.

Set the number of signatories required.

Choose the ordering of the parts.

Use the address and redeem script however you like.

## Donations

Since this project is the efforts of many people, most of which don't appear in
the obvious places like code or issues, donating to the project itself causes
significant operational difficulties.

As a result, if you would like to support this project financially you are
encouraged to donate to one of the many groups that makes the internet a place
amenable to projects such as this one.

[Donation-accepting organizations and projects](https://en.bitcoin.it/wiki/Donation-accepting_organizations_and_projects)

If the list is too difficult to choose from, the EFF is a good choice.

[Electronic Frontier Foundation](https://supporters.eff.org/donate)

or for a direct bitcoin address, consider donating to the
[Free Software Foundation](https://www.fsf.org/about/ways-to-donate/)
at 1PC9aZC4hNX2rmmrt7uHTfYAS3hRbph4UN

![alt text](https://static.fsf.org/nosvn/images/bitcoin_qrcodes/fsf.png "FSF Bitcoin Address")

## Making changes

Please do not make modifications to `multisig-standalone.html`, since they will
be overwritten by `compile.py`.

Make changes in `src/*` and apply them using the command `python compile.py`

# License

This multisig tool is released under the terms of the MIT license. See LICENSE
for more information or see https://opensource.org/licenses/MIT.
