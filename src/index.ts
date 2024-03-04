import { BigNumber, ethers } from 'ethers'

import { pairs, VOLT, VOLT_MAKER_ADDRESS, VOLT_MAKER_V4_ADDRESS, xVOLT } from './constants'
import VOLT_MAKER_ABI from './constants/abis/voltMaker.json'
import ERC20_ABI from './constants/abis/erc20.json'
import signer from './signer'

function calculateGasMargin(value: BigNumber): BigNumber {
    return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

async function buyback() {
    try {
        const voltMaker = new ethers.Contract(VOLT_MAKER_ADDRESS, VOLT_MAKER_ABI, signer)
    
        for (const pair of pairs) {
            try {
                const estimateGas = await voltMaker.estimateGas.convert(pair[0], pair[1])
                await voltMaker.convert(pair[0], pair[1], { 
                    gasLimit: calculateGasMargin(estimateGas)
                })

                console.log(`V3 Converted pair for ${pair[0]}, ${pair[1]}`)
            } catch (error) {
                console.error(`Failed to convert pair for ${pair[0]}, ${pair[1]} `, error)
            }
        }

    } catch (error) {
        console.error(error)
    }

    try {
        const voltMaker = new ethers.Contract(VOLT_MAKER_V4_ADDRESS, VOLT_MAKER_ABI, signer)
    
        for (const pair of pairs) {
            try {
                const estimateGas = await voltMaker.estimateGas.convert(pair[0], pair[1])
                await voltMaker.convert(pair[0], pair[1], { 
                    gasLimit: calculateGasMargin(estimateGas)
                })

                console.log(`V4 Converted pair for ${pair[0]}, ${pair[1]}`)
            } catch (error) {
                console.error(`Failed to convert pair for ${pair[0]}, ${pair[1]} `, error)
            }
        }

    } catch (error) {
        console.error(error)
    }
}

async function transferRewards() {
    try {
        const voltToken = new ethers.Contract(VOLT, ERC20_ABI, signer)

        await voltToken.transfer(xVOLT, '27777000000000000000000')
    } catch (error) {
        console.error('Failed to transfer rewards', error)
    }
}

setInterval(buyback, Number(process.env.INTERVAL))
setInterval(transferRewards, Number('86400000'))

console.log('Starting buybacks and rewards bot...')

