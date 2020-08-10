
import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  Approval,
  Transfer,
  OwnershipTransferred,
  PayoutClaimed,
  PayoutSnapshotTaken,
  PoolGrilled,
} from "../generated/Contract/Contract"

import { handleTransfer } from './handleTransfer'
import { handleApproval } from './handleApproval'
import { handlePayoutClaimed } from './handlePayoutClaimed'
import { handlePoolGrilled } from './handlePoolGrilled'

export { handleTransfer, handleApproval, handlePayoutClaimed }


export function handleOwnershipTransferred(event: OwnershipTransferred): void {}


export function handlePayoutSnapshotTaken(event: PayoutSnapshotTaken): void {}



