import { BigInt, Address, log } from "@graphprotocol/graph-ts"
import {
  Approval
} from "../generated/Contract/Contract"
import { TokenHolder, Transfer as TokenTransfer } from "../generated/schema"
import { getTransfer, getTokenHolder, getApproval } from "./HELPERS"

export function handleApproval(event: Approval): void {

  // let owner = event.params.owner
  // let spender = event.params.spender
  // let amount = event.params.amount

  //Get the Owner
  let owner = getTokenHolder(event.params.owner.toHexString())

  //Get the spender
  let spender = getTokenHolder(event.params.spender.toHexString())

  //Get the Approval object
  let approval = getApproval(owner.id.concat(spender.id))

  //Add data to approval object
  approval.timestamp = event.block.timestamp
  approval.block = event.block.number
  approval.owner = Address.fromString(owner.id)
  approval.spender = Address.fromString(spender.id)
  approval.amount = event.params.value


  /*
  Here we want to make sure this approval is in the TokenHolders Approvals list. 
  We also want to be sure not to add this approval if it's already in the list
  And we want to remove it from the list if the amount approved is 0.
  Note, we are using for loops because AssemblyScript array methods seem unreliable.
  */

  //TODO: Make this DRY

  let outstandingApprovals = owner.approvals

  /*
  This is unfortunately causing performance problems. Will need to rethink.
  //If spender is already approved, we don't need to add anything to the tokenholder list.
  // if (outstandingApprovals.length > 0) {
  //   log.warning("Token Holder already has a list of Approvals, we need to loop through it.", [])
  //   let targetApprovalId = owner.id.concat(spender.id)
  //   let newListOfApprovals = new Array<string>()

  //   //Loop through all the tokehHolders approvals to see if this one is in the list. 
  //   log.warning("Inside first approval loop, outstanding approval count: {}", [BigInt.fromI32(outstandingApprovals.length).toString()])
  //   for (let i = 0; i < outstandingApprovals.length; +11) {
  //     //We are creating a new list with all the approvals, eliminating this approval if amount is zero.
  //     if (outstandingApprovals[i] == targetApprovalId) {
  //       if (approval.amount > BigInt.fromI32(0)) {
  //         newListOfApprovals.push(outstandingApprovals[i])
  //       }
  //     } else {
  //       if(approval.amount > BigInt.fromI32(0)){
  //       newListOfApprovals.push(outstandingApprovals[i])
  //       }
  //     }
  //   }
  //   owner.approvals = newListOfApprovals
  // } else {
  //   //If the spender has no approvals yet and the amount is over 0, we push in this new approval
  //   if(approval.amount > BigInt.fromI32(0)){
  //   outstandingApprovals.push(approval.id)
  //   owner.approvals = outstandingApprovals
  //   }
  // }
  */

  //For now, just add this approval to the list of approvals. 

    outstandingApprovals.push(approval.id)
    owner.approvals = outstandingApprovals
    

  /*
  Here we are doing the same like above, this time we are checking the Spenders 'spendFromApprovals' list
  to add or remove this approval from their list. 
  */

  let outstandingSpendApprovals = spender.spendFromApprovals

  // log.warning("Outstanding Spend approvals length: {} ", [BigInt.fromI32(outstandingSpendApprovals.length).toString()])
  // if (outstandingSpendApprovals.length > 0) {
  //   let targetApprovalId = owner.id.concat(spender.id)
  //   let newListOfApprovals = new Array<string>()
  //   for (let i = 0; i < outstandingSpendApprovals.length; i++) {
  //     log.warning("inside second approval loop",[])
  //     if (outstandingSpendApprovals[i] == targetApprovalId) {
  //       if (approval.amount > BigInt.fromI32(0)) {
  //         newListOfApprovals.push(outstandingSpendApprovals[i])
  //       }
  //     } else {
  //       if(approval.amount > BigInt.fromI32(0)){
  //       newListOfApprovals.push(outstandingSpendApprovals[i])
  //       }
  //     }
  //   }
  // } else {
  //   if(approval.amount > BigInt.fromI32(0)){
  //   outstandingSpendApprovals.push(approval.id)
  //   spender.spendFromApprovals = outstandingSpendApprovals
  //   }
  // }


    outstandingSpendApprovals.push(approval.id)
    spender.spendFromApprovals = outstandingSpendApprovals
    
    
  owner.save()
  spender.save()
  approval.save()

}
