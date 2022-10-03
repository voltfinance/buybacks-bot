import { ethers } from 'ethers'

import { pairs, VOLT_MAKER_ADDRESS } from './constants'
import VOLT_MAKER_ABI from './constants/abis/voltMaker.json'
import signer from './signer'


async function buyback() {
    try {
        const voltMaker = new ethers.Contract(VOLT_MAKER_ADDRESS, VOLT_MAKER_ABI, signer)
    
        for (const pair of pairs) {
            try {
                await voltMaker.convert(pair[0], pair[1], {
                    gasPrice: '10000000000',
                    gasLimit: '19980470'
                })
            } catch (error) {
                console.error(`Failed to convert pair for ${pair[0]}, ${pair[1]} `, error)
            }
        }

    } catch (error) {
        console.error(error)
    }
}

console.log('Starting buybacks bot...')

// setInterval(buyback, Number(process.env.INTERVAL))
buyback()
