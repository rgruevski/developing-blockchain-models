const express = require('express');
const app = express();
let Block = require("./components/Block");
let Blockchain = require("./components/Blockchain");
let Transaction = require("./components/Transaction");

app.get("/blockchain", (req, res) => {

    let transaction = new Transaction("Sebastian", "Rob", 10);

    let genesisBlock = new Block();
    let blockchain = new Blockchain(genesisBlock);

    let block = blockchain.getNextBlock([transaction]);
    blockchain.addBlock(block);

    let anotherTransaction = new Transaction("Murphy", "Rob", 100);
    let anotherBlock = blockchain.getNextBlock([anotherTransaction, transaction]);
    blockchain.addBlock(anotherBlock);

    res.json(blockchain);
})

app.listen(8080, () => {
    console.log("Server listening on port 8080...")
})

