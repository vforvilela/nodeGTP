# NodeGTP

Engage in seamless conversation with your node (and a handful of APIs).

Your written queries seamlessly transform into Bitcoin node commands, and the resulting command responses are translated back into user-friendly answers. It's currently in the proof-of-concept stage—an open invitation to join and enhance the journey together.

## Examples

### Blocks

```
> How many transactions the block at height 78 had and when it was mined?
< The block at height 78 had 1 transaction and it was mined on January 11, 2009 at 01:00:54 UTC.
```

```
> What is the current block?
< The current block is block height 819033. Its hash is 00000000000000000002459fd5217909557f2fb21c79610633f53dedf74b0afe. It has 1 confirmation and was mined on November 29, 2023, at 20:02:50 UTC. The block contains 3410 transactions and has a difficulty of 67957790298897.88.
```

```
> How long since the last block?
< The last block was mined approximately 1 minute and 8 seconds ago.
```

### Halving

```
> How long till next halving?
< The next halving is estimated to occur at block height 840000, which is expected to happen on April 23, 2024.
```

```
> When was the first halving?
< The first halving occurred at block height 210,000 on November 28, 2012.

> When will be the last halving?
< The last halving will occur at block height 6930000. The estimated time for this halving is on February 7, 2140.
```

### Price

```
> What is the current price of bitcoin?
< The current price of Bitcoin is $37,660.09.
```

```
> What is the current price of bitcoin in Brazilian Real?
< The current price of Bitcoin in Brazilian Real (BRL) is 185,406 BRL.

```

## Installation

`npm instal`

## Configuration

`cp .env.example .env`

Edit `.env`

## Run

`node src/nodegpt.mjs`
