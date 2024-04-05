import * as fs from "fs";
import { VOTING_PERIOD, developmentChains, proposalsFile } from "../helper-hardhat-config";
import { network, ethers } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";

const index = 0;
async function main(porposalIndex: number) {
  const porposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"));
  const propsalsId = porposals[network.config.chainId!][porposalIndex];
  const govroner = await ethers.getContract("GovernorContract");

  // 0 = against, 1 = for, 2 = abstain for this example
  const voteWay = 1;
  const reason = "I like this proposal";
  const voteTxResponse = await govroner.castVoteWithReason(
    propsalsId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);
  
  if(developmentChains.includes(network.name)){
    await moveBlocks(VOTING_PERIOD + 1)
  }
  console.log("Voted! Ready to go!");

}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
