
import { BigInt, Address, log } from "@graphprotocol/graph-ts"
import {
  PayoutClaimed,
  Contract,
  PoolGrilled
} from "../generated/Contract/Contract"
import { TokenHolder, Payout } from "../generated/schema"
import { getTransfer, getTokenHolder, getApproval } from "./HELPERS"

export function handlePoolGrilled(event: PoolGrilled): void {

    log.warning("Claiming Rewards", [])
    //Get the Claimant
    let claimant = getTokenHolder(event.params.topHolderAddress.toHexString())
  
    //Create a new Payout
    let payout = new Payout(event.transaction.hash.toHex())

    //Add details to Payout
    payout.timestamp = event.block.timestamp
    payout.block = event.block.number
    payout.claimant = claimant.id
    payout.reward = event.params.claimedReward

    //Add Payout to TokenHolder
    let payouts = claimant.claimedPayouts
    payouts.push(payout.id)
    claimant.claimedPayouts = payouts

    //Add Payout amount to TokenHolder
    claimant.claimedPayoutTotal = claimant.claimedPayoutTotal.plus(event.params.claimedReward)


    //Get the new Balance of TokenHolder from the contract directly
    let contract = Contract.bind(event.address)
    let callResult = contract.try_balanceOf(event.params.topHolderAddress)
    if (callResult.reverted){
        log.error("Getting Tendie Balance of {} failed.", [claimant.id])
    } 
    let balance = callResult.value

    //Set tokenholders new balance
    claimant.balance = balance

    //Save Payout
    payout.save()

    //Save Claiment/Tokenholder
    claimant.save()
}