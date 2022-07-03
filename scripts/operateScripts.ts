// SPDX-License-Identifier: MIT
import { ethers } from "ethers";
import hre from "hardhat";
import * as TokenJson from "../artifacts/contracts/Token.sol/MyToken.json";

const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

// Returns the Ethereum balance of a given address:
async function getBalance(address: string | Promise<string>) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of address:
async function printBalances(addresses: string[]) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

async function main() {
  console.log("== start ==");

  // Get the example accounts we'll be working with.
  const [voter1, voter2, voter3] = await hre.ethers.getSigners();

  //   // Wallet creation:
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);

  console.log(`Using address ${wallet.address}`);

  const provider = ethers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);

  const Token = await hre.ethers.getContractFactory("MyToken");
  const token = await Token.deploy();
  await token.deployed();
  console.log("My Token Deployed To:", token.address);

  // Mint tokens:
  const addresses = [voter1.address, voter2.address, voter3.address];

  console.log("== starting token balances ==");
  await printBalances(addresses);

  const amount = 10;
  await token.connect(signer).mint(voter1.address, amount);
  await token.connect(signer).mint(voter2.address, amount);
  await token.connect(signer).mint(voter3.address, amount);
  console.log("== token balances after mint: ");
  await printBalances(addresses);

  // Delegate:2

  // Create a ballot:

  // Create votes:

  // Query the results:
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
