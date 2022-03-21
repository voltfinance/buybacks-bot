import { Wallet, providers } from 'ethers'

const provider = new providers.JsonRpcProvider(process.env.RPC_URL)

export default new Wallet(process.env.PRIVATE_KEY ?? '', provider)
