import {
  FUNC,
  MIN_DELAY,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  developmentChains,
} from "../helper-hardhat-config";
import { ethers, network } from "hardhat";
import { moveTime } from "../utils/move-time";
import { moveBlocks } from "../utils/move-blocks";

export async function queueAndExecute() {
  const args = [NEW_STORE_VALUE];
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);
  const descriptionHash = ethers.keccak256(
    ethers.toUtf8Bytes(PROPOSAL_DESCRIPTION)
  );

  const gorvoner = await ethers.getContract("GovernorContract");
  console.log("Queueing...");
  const queryTx = await gorvoner.queue(
    [await box.getAddress()],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await queryTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }
  console.log("Executing...");
  const excuteTx = await gorvoner.execute(
    [await box.getAddress()],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await excuteTx.wait(1);

  const boxNewValue = await box.retrieve();
  console.log(`New Box Value ${boxNewValue}`);
  
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
