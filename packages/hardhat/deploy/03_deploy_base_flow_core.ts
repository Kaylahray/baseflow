import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "BaseFlowImplementation" using the deployer account and
 * constructor arguments set to a USDC token address (using a mock address for testnet)
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployBaseFlowImplementation: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network liskSepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // For testnet, we'll use a mock USDC address (you should replace this with actual USDC on mainnet)
  // On Lisk Sepolia, you might need to deploy a mock USDC or use the actual bridged USDC address
  const mockUSDCAddress = "0x0000000000000000000000000000000000000001"; // Placeholder - replace with actual USDC

  await deploy("BaseFlowImplementation", {
    from: deployer,
    // Contract constructor arguments
    args: [mockUSDCAddress],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const baseFlowContract = await hre.ethers.getContract<Contract>("BaseFlowImplementation", deployer);

  try {
    // Add a small delay to ensure contract is fully deployed
    await new Promise(resolve => setTimeout(resolve, 1000));
    const owner = await baseFlowContract.owner();
    console.log("🔄 BaseFlow deployed! Owner:", owner);
  } catch (error) {
    console.log("🔄 BaseFlow deployed successfully at:", baseFlowContract.target || baseFlowContract.address);
    console.log("⚠️  Could not fetch owner address immediately, but deployment succeeded");
  }
};

export default deployBaseFlowImplementation;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags BaseFlowImplementation
deployBaseFlowImplementation.tags = ["BaseFlowImplementation"];
