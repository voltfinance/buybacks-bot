import { BigNumber, ethers } from 'ethers'

import { FEE_MANAGER_ADDRESS } from './constants'
import FEE_MANAGER_ABI from './constants/abis/FeeManager.json'
import signer from './signer'
import dotenv from 'dotenv'
dotenv.config()

function calculateGasMargin(value: BigNumber): BigNumber {
    return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

async function buyback() {
    try {
        const feeManager = new ethers.Contract(FEE_MANAGER_ADDRESS, FEE_MANAGER_ABI, signer)
        for (let i = 0; i < 4; i++) {
            try {
                const estimateGas = await feeManager.estimateGas.collectFee(i)
                await feeManager.collectFee(i, {
                    gasLimit: calculateGasMargin(estimateGas)
                })

                console.log(`Convert run for ${i} feeCollector`)
            } catch (error) {
                console.error(`Failed to convert for ${i} feeCollector`, error)
            }
        }

    } catch (error) {
        console.error(error)
    }
}

async function transferRewards() {
    const feeManager = new ethers.Contract(FEE_MANAGER_ADDRESS, FEE_MANAGER_ABI, signer)
    try {
        const estimateGas = await feeManager.estimateGas.distribute()
        await feeManager.distribute({
            gasLimit: calculateGasMargin(estimateGas)
        })
        console.log('Rewards transferred')
    }
    catch (error) {
        console.error('Failed to transfer rewards', error)
    }
}
setInterval(buyback, Number(process.env.INTERVAL))
setInterval(transferRewards, 7 * 24 * 60 * 60 * 1000)

console.log('Starting buybacks and rewards bot...')

