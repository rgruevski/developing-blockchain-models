// Represents a particular block in the block-chain.
class Block {

    // The constructor initializes appropriate properties for the Block.
    constructor() {
        this.index = 0,
        this.previousHash = "",
        this.hash = "",
        this.nonce = 0,
        this.transactions = []
    }

    // This get returns the key for the Block.
    get key() {
        return JSON.stringify(this.transactions) + this.index + this.previousHash + this.nonce;
    }

    // This function will add new transactions to the Block's transactions array.
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

}
module.exports = Block;