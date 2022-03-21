import dotenv from 'dotenv'
import { ethers } from 'ethers'
dotenv.config()

import { pairs, VOLT_MAKER_ADDRESS } from './constants'
import VOLT_MAKER_ABI from './constants/abis/voltMaker.json'
import signer from './signer'


async function buyback() {
    try {
        const voltMaker = new ethers.Contract(VOLT_MAKER_ADDRESS, VOLT_MAKER_ABI, signer)
    
        let params: any = [[], []]
    
        for (const pair of pairs) {
            params = [[...params[0], pair[0]], [...params[1], pair[1]]]
        }
    
        await voltMaker.convertMultiple(params[0], params[1])
    } catch (error) {
        console.error(error)
    }
}

console.log('Starting buybacks bot...')

setInterval(buyback, Number(process.env.INTERVAL))
