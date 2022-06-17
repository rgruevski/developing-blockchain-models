const Block = require("./components/Block");
const Blockchain = require("./components/Blockchain");
const Transaction = require("./components/Transaction");
const BlockchainNode = require("./components/BlockchainNode");
const fetch = require("node-fetch");
const express = require('express');
const { response } = require("express");

const cliArgument = process.argv[2];
const PORT = Number.parseInt(cliArgument) ? cliArgument : 8080;

const app = express();

// request body parser for json
app.use(express.json());

let transactions = [];
let nodes = [];
let allTransactions = [];

let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);

app.get("/resolve", (req, res) => {

    return nodes.forEach((node) => {

        fetch(`${node.url}/blockchain`)
            .then(response => response.json())
            .then(otherBlockchain => {
                if (blockchain.blocks.length < otherBlockchain.blocks.length) {
                    allTransactions.forEach((transaction) => {

                        fetch(`${node.url}/transactions`, {
                            "method": "POST",
                            "headers": {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(transaction)
                        }).then((response) => response.json())
                            .then(_ => {
                                fetch(`${node.url}/mine`)
                                    .then((response) => response.json())
                                    .then(_ => {
                                        fetch(`${node.url}/blockchain`)
                                            .then((response) => response.json())
                                            .then((updatedBlockchain) => {
                                                console.log(`Blockchain updated successfully...`);
                                                blockchain = updatedBlockchain;
                                                res.json(blockchain);
                                            });
                                    });
                            });
                    });
                } else {
                    res.json(blockchain);
                }
            });
    });
});

app.post("/nodes/register", (req, res) => {
    const urls = req.body;
    urls.forEach((url) => {
        const node = new BlockchainNode(url);
        nodes.push(node);
        console.log(`${node.url} registered to blockchain...\n`);
    });
    res.json(nodes);
});

app.post("/transactions", (req, res) => {

    const { to, from, amount } = req.body;
    const transaction = new Transaction(to, from, amount);

    transactions.push(transaction);
    
    console.log(`${transaction} added to block...\n`);
    res.json(transactions);
});

app.get("/mine", (req, res) => {
    const block = blockchain.getNextBlock(transactions);
    blockchain.addBlock(block);
    transactions.forEach((transaction) => {
        allTransactions.push(transaction);
    })
    transactions = [];
    console.log(`Block #${block.index} mined successfully...`);
    res.json(block);
});

app.get("/blockchain", (req, res) => res.json(blockchain));

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}...\n`);
})