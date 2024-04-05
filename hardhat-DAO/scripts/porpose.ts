import { ethers, network } from "hardhat";
import {
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  VOTING_DELAY,
  developmentChains,
  proposalsFile
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import * as fs from "fs";

export async function porpose(
  args: any[],
  functionTOCall: string,
  porposalDescription: string
) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionTOCall,
    args
  );

  console.log(
    `Proposing ${functionTOCall} on ${await box.getAddress()} with ${args}`
  );
  console.log(`Proposal Description: \n ${porposalDescription}`);

  const proposeTx = await governor.propose(
    [await box.getAddress()],
    [0],
    [encodedFunctionCall],
    porposalDescription
  );
  const porposeReceipt = await proposeTx.wait(1);

  if(developmentChains.includes(network.name)){
    await moveBlocks(VOTING_DELAY + 1);
  }
  const porposalID = porposeReceipt.logs[0].args.proposalId;
  storeProposalId(porposalID)
}

function storeProposalId(proposalId: any) {
    const chainId = network.config.chainId!.toString();
    let proposals:any;
  
    if (fs.existsSync(proposalsFile)) {
        proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
    } else {
        proposals = { };
        proposals[chainId] = [];
    }   
    proposals[chainId].push(proposalId.toString());
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8");
  }

porpose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
});
