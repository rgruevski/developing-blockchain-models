let Block = require("./components/Block");
let Blockchain = require("./components/Blockchain");
let Transaction = require("./components/Transaction");

const express = require('express');
const { response } = require("express");
const app = express();

app.use(express.json());

let transactions = [];
let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);

app.post("/transactions", (req, res) => {

    let to = req.body.to;
    let from = req.body.from;
    let amount = req.body.amount;

    let transaction = new Transaction(to, from, amount);

    transactions.push(transaction);

    res.json(transactions);
});

app.get("/mine", (req, res) => {
    let block = blockchain.getNextBlock(transactions);
    blockchain.addBlock(block);
    res.json(block);
})

app.get("/blockchain", (req, res) => {
    res.json(blockchain);
    // let transaction = new Transaction("Sebastian", "Rob", 10);

    // let genesisBlock = new Block();
    // let blockchain = new Blockchain(genesisBlock);

    // let block = blockchain.getNextBlock([transaction]);
    // blockchain.addBlock(block);

    // let anotherTransaction = new Transaction("Murphy", "Rob", 100);
    // let anotherBlock = blockchain.getNextBlock([anotherTransaction, transaction]);
    // blockchain.addBlock(anotherBlock);

    // res.json(blockchain);
})

app.listen(8080, () => {
    console.log("Server listening on port 8080...")
})

