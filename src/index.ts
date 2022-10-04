import { BigNumber, ethers } from 'ethers'

import { pairs, VOLT_MAKER_ADDRESS } from './constants'
import VOLT_MAKER_ABI from './constants/abis/voltMaker.json'
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

                console.log(`Converted pair for ${pair[0]}, ${pair[1]}`)
            } catch (error) {
                console.error(`Failed to convert pair for ${pair[0]}, ${pair[1]} `, error)
            }
        }

    } catch (error) {
        console.error(error)
    }
}

console.log('Starting buybacks bot...')

setInterval(buyback, Number(process.env.INTERVAL))
