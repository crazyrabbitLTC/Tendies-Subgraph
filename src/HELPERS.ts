import { BigInt, BigDecimal, log, Address, ByteArray } from "@graphprotocol/graph-ts"
import { TokenHolder, Transfer, Approval } from "../generated/schema"
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'



export function getTokenHolder(tokenHolderId: string): TokenHolder {

    //TokenHolder ID should be created by the address using toHexString()
    let tokenHolder = TokenHolder.load(tokenHolderId)

    if (tokenHolder == null ){
        tokenHolder = new TokenHolder(tokenHolderId)
        log.debug("New Token holder created: {}", [tokenHolderId])
        tokenHolder.balance = BigInt.fromI32(0)
        tokenHolder.transfers = []
        tokenHolder.approvals = []
        tokenHolder.spendFromApprovals = []
        tokenHolder.claimedPayouts = []
        tokenHolder.claimedPayoutTotal = BigInt.fromI32(0)
    }
    
    return tokenHolder as TokenHolder
}

export function getTransfer(transferId: string): Transfer {

    //Transfer ID should be from  event.transaction.hash.toHex()
    let transfer = Transfer.load(transferId)

    if (transfer == null) {
        transfer = new Transfer(transferId)
        log.debug("New Transfer created at tx: {} ", [transferId])
        transfer.timestamp = BigInt.fromI32(0)
        transfer.block = BigInt.fromI32(0)
        transfer.from = Address.fromString(ADDRESS_ZERO)
        transfer.to = Address.fromString(ADDRESS_ZERO)
        transfer.amount = BigInt.fromI32(0)
    }

    return transfer as Transfer
}

export function getApproval(approvalId: string): Approval {

    //Approval should be a concatination of Owner+Spender
    let approval = Approval.load(approvalId)

    if(approval ==null) {
        approval = new Approval(approvalId)
        log.debug("New Approval Created for approval Id: {}", [approvalId])
        approval.timestamp = BigInt.fromI32(0)
        approval.block = BigInt.fromI32(0)
        approval.owner = Address.fromString(ADDRESS_ZERO)
        approval.spender = Address.fromString(ADDRESS_ZERO)
        approval.amount = BigInt.fromI32(0)
    }

    return approval as Approval
}
