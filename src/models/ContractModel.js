import { CanvasInfo } from './CanvasInfo'
import { Bid } from './Bid'
import { Transaction, TRANSACTION_TYPE } from './Transaction'
import { TransactionWithPixel } from './TransactionWithPixel'
import { CanvasSellOffer } from './CanvasSellOffer'
import { CanvasBuyOffer } from './CanvasBuyOffer'
import { PainterReward } from './PainterReward'
import { BLOCKCHAIN_CANVAS_STATES, CanvasState } from './CanvasState'
import { WithdrawBalanceTransaction } from './transactions/WithdrawBalanceTransaction'
import { AddRewardToBalanceTransaction } from './transactions/AddRewardToBalanceTransaction'

const GAS_LIMIT = 150000
const GAS_PRICE = 2000000000

export class ContractModel {
  constructor (Contract, account) {
    this._Contract = Contract
    this._account = account
    this.config = {
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      from: account,
    }
    console.log('New ContractModel with account ', account)
  }

  get Contract () {
    return this._Contract
  }

  get account () {
    return this._account
  }

  setPixel ({ canvasId, pixelIndex, colorId }) {
    return new Promise((resolve, reject) => {
      this.Contract.setPixel(canvasId, pixelIndex.id, colorId, this.config, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Set pixel failed')
          reject(error)
        } else {
          const tx: TransactionWithPixel = {
            hash: txHash,
            type: TRANSACTION_TYPE.setPixel,
            name: `Set pixel (x: ${pixelIndex.x}, y: ${pixelIndex.y}) to color #${colorId} on Canvas #${canvasId}`,
            canvasId: canvasId,
            colorId: colorId,
            pixelIndex: pixelIndex,
            timestamp: new Date(),
          }
          resolve(new TransactionWithPixel(tx))
        }
      })
    })
  }

  makeBid ({ canvasId, bidAmountInWei }) {
    return new Promise((resolve, reject) => {
      this.Contract.makeBid(canvasId, { ...this.config, value: bidAmountInWei }, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Make bid failed')
          reject(error)
        } else {
          const tx = {
            hash: txHash,
            type: TRANSACTION_TYPE.makeBid,
            name: `Bid on Canvas #${canvasId}`,
            timestamp: new Date(),
          }
          resolve(new Transaction(tx))
        }
      })
    })
  }

  createCanvas () {
    return new Promise((resolve, reject) => {
      this.Contract.createCanvas({}, this.config, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Create canvas failed')
          reject(error)
        } else {
          const tx = {
            hash: txHash,
            type: TRANSACTION_TYPE.createCanvas,
            name: 'Create Canvas',
            timestamp: new Date(),
          }
          resolve(new Transaction(tx))
        }
      })
    })
  }

  makeBuyOffer (canvasId, valueInWei) {
    return new Promise((resolve, reject) => {
      this.Contract.makeBuyOffer(canvasId, { ...this.config, value: valueInWei }, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Make buy offer failed')
          reject(error)
        } else {
          const tx = {
            hash: txHash,
            type: TRANSACTION_TYPE.buyOffer,
            name: `Buy Offer on Canvas #${canvasId}`,
            timestamp: new Date(),
          }
          resolve(new Transaction(tx))
        }
      })
    })
  }

  cancelBuyOffer (canvasId) {
    return new Promise((resolve, reject) => {
      this.Contract.cancelBuyOffer(canvasId, this.config, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Cancel buy offer failed')
          reject(error)
        } else {
          const tx = {
            hash: txHash,
            type: TRANSACTION_TYPE.cancelBuyOffer,
            name: `Cancel Offer on Canvas #${canvasId}`,
            timestamp: new Date(),
          }
          resolve(new Transaction(tx))
        }
      })
    })

  }

  acceptBuyOffer (canvasId, priceInWei) {
    return new Promise((resolve, reject) => {
      this.Contract.acceptBuyOffer(canvasId, priceInWei, this.config, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Accept buy offer failed')
          reject(error)
        } else {
          const tx = {
            hash: txHash,
            type: TRANSACTION_TYPE.acceptBuyOffer,
            name: `Accept Buy Offer on Canvas #${canvasId}`,
            timestamp: new Date(),
          }
          resolve(new Transaction(tx))
        }
      })
    })
  }

  offerForSale (canvasId, price) {
    return new Promise((resolve, reject) => {
      this.Contract.offerCanvasForSale(canvasId, price, this.config, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Offer for sale failed')
          reject(error)
        } else {
          const tx = {
            hash: txHash,
            type: TRANSACTION_TYPE.offerForSale,
            name: `Offer Canvas #${canvasId} for sale`,
            timestamp: new Date(),
          }
          resolve(new Transaction(tx))
        }
      })
    })
  }

  offerForSaleToAddress (canvasId, price, receiverAddress) {
    return new Promise((resolve, reject) => {
      this.Contract.offerCanvasForSaleToAddress(canvasId, price, receiverAddress, this.config, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Offer for sale to address failed')
          reject(error)
        } else {
          const tx = {
            hash: txHash,
            type: TRANSACTION_TYPE.offerForSaleToAddress,
            name: `Offer Canvas #${canvasId} for sale to address ${receiverAddress}`,
            timestamp: new Date(),
          }
          resolve(new Transaction(tx))
        }
      })
    })
  }

  cancelSellOffer (canvasId) {
    return new Promise((resolve, reject) => {
      this.Contract.cancelSellOffer(canvasId, this.config, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Cancel sell offer failed')
          reject(error)
        } else {
          const tx = {
            hash: txHash,
            type: TRANSACTION_TYPE.cancelSellOffer,
            name: `Cancel Sell Offer for Canvas #${canvasId}`,
            timestamp: new Date(),
          }
          resolve(new Transaction(tx))
        }
      })
    })
  }

  acceptSellOffer (canvasId, priceInWei) {
    return new Promise((resolve, reject) => {
      this.Contract.acceptSellOffer(canvasId, { ...this.config, value: priceInWei }, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Buy Canvas failed')
          reject(error)
        } else {
          const tx = {
            hash: txHash,
            type: TRANSACTION_TYPE.acceptSellOffer,
            name: `Buy Canvas #${canvasId}`,
            timestamp: new Date(),
          }
          resolve(new Transaction(tx))
        }
      })
    })
  }

  addRewardToAccountBalance (canvasId) {
    return new Promise((resolve, reject) => {
      this.Contract.addRewardToPendingWithdrawals(canvasId, { ...this.config }, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Add Reward to Account Balance failed')
          reject(error)
        } else {
          const tx: AddRewardToBalanceTransaction = {
            hash: txHash,
            type: TRANSACTION_TYPE.addRewardToBalance,
            name: `Add Reward for Canvas #${canvasId} to Account Balance`,
            timestamp: new Date(),
            canvasId,
          }
          resolve(new AddRewardToBalanceTransaction(tx))
        }
      })
    })
  }

  withdrawBalance ({ address, amount }) {
    return new Promise((resolve, reject) => {
      this.Contract.withdraw({ ...this.config }, (error, txHash) => {
        if (error) {
          console.log(error)
          console.log('[ERROR] Withdraw Account Balance failed')
          reject(error)
        } else {
          const tx: WithdrawBalanceTransaction = {
            hash: txHash,
            type: TRANSACTION_TYPE.withdrawBalance,
            name: `Withdraw Account Balance`,
            timestamp: new Date(),
            address,
            amount,
          }
          resolve(new WithdrawBalanceTransaction(tx))
        }
      })
    })
  }

  /**
   * View functions (free)
   */

  getCanvasIdsByState (canvasState) {
    const state = Object.entries(BLOCKCHAIN_CANVAS_STATES).findIndex(state => state[ 1 ] === canvasState)
    if (state < 0) {
      return Promise.reject('Incorrect state')
    }
    return new Promise((resolve, reject) => {
      this.Contract.getCanvasByState(state, this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(result.map(canvasId => parseInt(canvasId, 10)))
        }
      })
    })
  }

  getCanvasCount () {
    return new Promise((resolve, reject) => {
      this.Contract.getCanvasCount(this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(parseInt(result, 10))
        }
      })
    })
  }

  getLastBid (canvasId) {
    return new Promise((resolve, reject) => {
      this.Contract.getLastBidForCanvas(canvasId, this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(new Bid(result))
        }
      })
    })
  }

  getCanvas (canvasId) {
    return new Promise((resolve, reject) => {
      this.Contract.getCanvasBitmap(canvasId, this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(result.map(pixel => parseInt(pixel, 10)))
        }
      })
    })
  }

  getCanvasInfo (canvasId) {
    return new Promise((resolve, reject) => {
      this.Contract.getCanvasInfo(canvasId, this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(new CanvasInfo(result))
        }
      })
    })
  }

  getCanvasState (canvasId) {
    return new Promise((resolve, reject) => {
      this.Contract.getCanvasState(canvasId, this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(new CanvasState(canvasId, parseInt(result, 10)))
        }
      })
    })
  }

  getCurrentBuyOffer (canvasId) {
    return new Promise((resolve, reject) => {
      this.Contract.getCurrentBuyOffer(canvasId, this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(new CanvasBuyOffer(result))
        }
      })
    })
  }

  getCurrentSellOffer (canvasId) {
    return new Promise((resolve, reject) => {
      this.Contract.getCurrentSellOffer(canvasId, this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(new CanvasSellOffer(result))
        }
      })
    })
  }

  getRewardInfo (canvasId, userAddress = '') {
    return new Promise((resolve, reject) => {
      this.Contract.calculateReward(canvasId, userAddress, this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(new PainterReward(result))
        }
      })
    })
  }

  getPixelAuthor (canvasId, pixelIndex) {
    return new Promise((resolve, reject) => {
      this.Contract.getPixelAuthor(canvasId, pixelIndex, this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }

  getOwnedCanvasCount (userAddress = '') {
    return new Promise((resolve, reject) => {
      this.Contract.balanceOf(userAddress, this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(parseInt(result, 10))
        }
      })
    })
  }

  getAccountBalance (userAddress = '') {
    return new Promise((resolve, reject) => {
      this.Contract.getPendingWithdrawal(userAddress, this.config, (error, result) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(parseInt(result, 10))
        }
      })
    })
  }

  /**
   * Subscription to events
   */

  PixelPaintedEvent (...args) {
    return this.Contract.PixelPainted(...args)
  }

  BidPostedEvent (...args) {
    return this.Contract.BidPosted(...args)
  }

  CanvasCreatedEvent (...args) {
    return this.Contract.CanvasCreated(...args)
  }

  BuyOfferMadeEvent (...args) {
    return this.Contract.BuyOfferMade(...args)
  }

  BuyOfferCancelledEvent (...args) {
    return this.Contract.BuyOfferCancelled(...args)
  }

  SellOfferMadeEvent (...args) {
    return this.Contract.CanvasOfferedForSale(...args)
  }

  SellOfferCancelledEvent (...args) {
    return this.Contract.CanvasNoLongerForSale(...args)
  }

  CanvasSoldEvent (...args) {
    return this.Contract.CanvasSold(...args)
  }
}