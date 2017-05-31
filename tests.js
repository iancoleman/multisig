// manual testing for now.
// See https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki#reference-implementation
//
// Accepts public keys
// 0491bba2510912a5bd37da1fb5b1673010e43d2c6d812c514e91bfa9f2eb129e1c183329db55bd868e209aac2fbc02cb33d98fe74bf23f0c235d6126b1d8334f86
// 04865c40293a680cb9c020e7b1e106d8c1916d3cef99aa431a56d253e69256dac09ef122b1a986818a7cb624532f062c1d1f8722084861c5c3291ccffef4ec6874
// 048d2455d2403e08708fc1f556002f1b6cd83f992d085097f9974ab08a28838f07896fbab08f39495e15fa6fad6edbfb1e754e35fa1c7844c41f322a1863d46213
//
// Accepts WIF
// 5JaTXbAUmfPYZFRwrYaALK48fN6sFJp4rHqq2QSXs8ucfpE4yQU
// 5Jb7fCeh1Wtm4yBBg3q3XbT6B525i17kVhy3vMC9AqfR6FH2qGk
// 5JFjmGo5Fww9p8gvx48qBYDJNAzR9pmH5S389axMtDyPT8ddqmw
//
// Accepts a mix of public keys and WIF
// Part list ignores invalid values
// Part list splits on any non-alphanumeric separator
// Order of parts matters
// The order of parts can be changed
// The network can be changed
// M is set to a sensible default
// N is displayed to the user
// M can be changed
// Setting parts to blank space clears existing details
// Discover button checks addresses for transactions
// Discover button does nothing if there are no parts
// Changing the parts mid-discover stops the current discovery process
// Changing the parts mid-discover clears the previous discovery information
// The discovery process says X of Y discoveries completed
// The discovery process can be cancelled part way through by pressing the cancel button
