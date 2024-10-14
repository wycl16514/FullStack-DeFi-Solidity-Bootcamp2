const { ethers, artifacts } = require("hardhat")
const fs = require("fs")

function savedContractToFrontend(contract, name) {
    const contractsDir = __dirname + "/../src/frontend/contracts"
    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true })
    }

    const contractArtifact = artifacts.readArtifactSync(name);
    fs.writeFileSync(
        contractsDir + `/${name}-address.json`,
        JSON.stringify({ address: contract.target }, null, 2)
    )

    fs.writeFileSync(contractsDir + `/${name}.json`,
        JSON.stringify(contractArtifact, null, 2))
}

async function main() {
    //get the deploy account, normally is Account#0
    const [deployer] = await ethers.getSigners()
    const tokenContractFactory = await ethers.getContractFactory("SimpleDeFiToken")
    //send the bytecode in artifacts directory to the virutal machine
    const token = await tokenContractFactory.deploy()
    //wait for the complete of deployment and we can get the depolyment address
    await token.waitForDeployment()
    //address of contract just like the port for your server program
    console.log("Simple DeFi token contract address: ", token.target)
    console.log("Deployer address: ", deployer.address)
    const balance = await deployer.provider.getBalance(deployer.address)
    console.log("Deployer ETH balance: ", balance.toString())

    savedContractToFrontend(token, 'SimpleDeFiToken')
}

try {
    main()
} catch (err) {
    console.error(err)
    process.exitCode = 1
}