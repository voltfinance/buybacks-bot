import { BigNumber, ethers } from 'ethers'

import { BURN_MANAGER_ADDRESS, FEE_MANAGER_ADDRESS } from './constants'
import FEE_MANAGER_ABI from './constants/abis/FeeManager.json'
import BURN_MANAGER_ABI from './constants/abis/BurnManager.json'
import signer from './signer'
import dotenv from 'dotenv'
dotenv.config()

function calculateGasMargin(value: BigNumber): BigNumber {
    return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

async function buyback() {
    try {
        const feeManager = new ethers.Contract(FEE_MANAGER_ADDRESS, FEE_MANAGER_ABI, signer)
        for (let i = 0; i < 5; i++) {
            try {
                const estimateGas = await feeManager.estimateGas.collectFee(i)
                await feeManager.collectFee(i, {
                    gasLimit: BigNumber.from(20000000)
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

async function burn(){
    const burnManager = new ethers.Contract(BURN_MANAGER_ADDRESS, BURN_MANAGER_ABI, signer)
    try {
        const estimateGas = await burnManager.estimateGas.burn()
        await burnManager.burn({
            gasLimit: calculateGasMargin(estimateGas)
        })
        console.log('Rewards burned')
    }
    catch (error) {
        console.error('Failed to burn rewards', error)
    }
}

setInterval(buyback, 24 * 60 * 60 * 1000)
setInterval(transferRewards, 7 * 24 * 60 * 60 * 1000)
setInterval(burn, 24 * 60 * 60 * 1000)

console.log('Starting buybacks and rewards bot...')
