import { BigInt } from "@graphprotocol/graph-ts"
import {
  Transfer
} from "../generated/Contract/Contract"
import { TokenHolder, Transfer as TokenTransfer } from "../generated/schema"
import { getTransfer , getTokenHolder} from "./HELPERS"

export function handleTransfer(event: Transfer): void {

  let to = event.params.to
  let from = event.params.from
  let amount = event.params.value

  //Get a new Transfer Object
  let transfer = getTransfer(event.transaction.hash.toHex())

  //Set Transfer Details
  transfer.timestamp = event.block.timestamp
  transfer.block = event.block.number
  transfer.from = from
  transfer.to = to
  transfer.amount = amount

  //Get the User Receiving funds
  let recipient = getTokenHolder(to.toHexString())

  //Get the User Sending funds
  let sender = getTokenHolder(from.toHexString())

  /*
  There is case to be made that it would be safer to load token balances directly from the contract.
  This is much less performant but could be nessesary in case supply/balances are unpredicatble. 
  See: Ampleforth as an example. 
  An additional idea would be to create a block handler every X number of blocks as a test to check
  balances, if it fails we can have a warning. 
  */

  //Add Balance to recipient
  recipient.balance = recipient.balance.plus(amount)

  //Deduct Balance from Sender
  sender.balance = recipient.balance.minus(amount)

  //Add Transfer entity to Recipient and Sender
  let recipientTransferList = recipient.transfers
  recipientTransferList.push(transfer.id)
  recipient.transfers = recipientTransferList

  let senderTransferList = sender.transfers
  senderTransferList.push(transfer.id)
  sender.transfers = senderTransferList

  //Save everything
  transfer.save()
  recipient.save()
  sender.save()
}
