import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as CustomBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { CustomBallot } from "../typechain";

const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";
async function main() {
  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = new ethers.Wallet(
    process.env.PRIVATE_KEY ?? EXPOSED_KEY
  ).connect(provider);

  const balance = Number(ethers.utils.formatEther(await signer.getBalance()));
  console.log(` Your wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error(
      " You dont have Not enough ether to perform this transaction"
    );
  }

  if (process.argv.length < 3)
    throw new Error(" the Ballot contract  address  is missing");
  const ballotAddress = process.argv[2];
  console.log(
    `Attaching ballot contract interface to address ${ballotAddress}`
  );

  const ballotContract = new Contract(
    ballotAddress,
    CustomBallotJson.abi,
    signer
  ) as CustomBallot;

  const winningProposalIndex = await ballotContract.winningProposal();
  console.log("winning proposal index", winningProposalIndex.toString());
  const winningProposal = await ballotContract.proposals(winningProposalIndex);
  console.log(
    "winning proposal vote count",
    winningProposal.voteCount.toString()
  );
  const winnerName = await ballotContract.winnerName();
  console.log("winner name", ethers.utils.parseBytes32String(winnerName));
}

main().catch((error) => {
  console.log(error);
});
