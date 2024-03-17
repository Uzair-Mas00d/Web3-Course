const { ethers } = require("hardhat")
const {expect, assert} = require("chai")

describe("SimpleStorage", function(){
  let SimpleStorageFactory, SimpleStorage
  beforeEach(async function(){
    SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    SimpleStorage = await SimpleStorageFactory.deploy()
  })

  it("Should start with a favorite number 0", async function(){
    const currentValue = await SimpleStorage.retrieve()
    const expectedValue = "0"
    assert.equal(currentValue.toString(), expectedValue)
    // expect(currentValue.toString()).to.equal(expectedValue)
  })

  it("Should update when we call store", async function(){
    const expectedValue = "7"
    const transactionResponse = await SimpleStorage.store(expectedValue)
    transactionResponse.wait(1)

    const currentValue = await SimpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  })

})