const { ethers } = require("hardhat")

async function main() {
    const [deployer] = await ethers.getSigners()
    const dataTypeContractFactory = await ethers.getContractFactory("SimpleException")
    const contract = await dataTypeContractFactory.deploy()
    await contract.waitForDeployment()

    console.log("SimpleException address: ", contract.target)
    console.log("Deployer address: ", deployer.address)

    const callPayableFunction = await ethers.getContractFactory("CallPayableFunction")
    const contract1 = await callPayableFunction.deploy()
    await contract1.waitForDeployment()
    console.log("CallPayableFunction address: ", contract1.target)
}

try {
    main()
} catch (err) {
    console.err(err)
    process.exitCode = 1
}