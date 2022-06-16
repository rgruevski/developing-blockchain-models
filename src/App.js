const Block = require("./components/Block");
const Blockchain = require("./components/Blockchain");
const Transaction = require("./components/Transaction");
const BlockchainNode = require("./components/BlockchainNode");
const fetch = require("node-fetch");

const cliArgument = process.argv[2];
const PORT = Number.parseInt(cliArgument) ? cliArgument : 8080;

const express = require('express');
const app = express();

// request body parser for json
app.use(express.json());

let nodes = [];
let transactions = [];
let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);

app.get("/resolve", (req, res) => {
    nodes.forEach(node => {
        fetch(`${node.url}/blockchain`)
            .then(res => res.json())
            .then(otherBlockchain => {
                if (blockchain.blocks.length < otherBlockchain.blocks.length) {
                    blockchain = otherBlockchain;
                }
            });
    })
})

app.post("/nodes/register", (req, res) => {
    const urls = req.body;
    urls.forEach((url) => {
        const node = new BlockchainNode(url);
        nodes.push(node);
        console.log(`${node.url} added to blockchain...\n`);
    });
    res.json(nodes);
});

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
    transactions = [];
    res.json(block);
});

app.get("/blockchain", (req, res) => {
    res.json(blockchain);
});

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}...\n`);
})