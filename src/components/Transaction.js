// Represents a Transaction that consumes a to, from, and amount.
class Transaction {
    // The constructor takes in the 3 variables and assigns the values to the newly initialized Transaction Properties.
    constructor(to, from, amount) {
        this.from = from
        this.to = to
        this.amount = amount
    };
}
module.exports = Transaction;