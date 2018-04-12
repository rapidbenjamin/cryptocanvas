import React from 'react'
import { Alert } from 'antd'

import './styles/AccountStatus.css'
import withWeb3 from '../../hoc/withWeb3'
import { cutAddress } from '../../helpers/strings'
import withModal from '../../hoc/withModal'
import TransactionsModal from '../Modals/TransactionsModal'
import { TransactionsSummary } from './TransactionsSummary'
import withTransactions from '../../hoc/withTransactions'

const StatusMetaMaskNotAvailable = () => (
  <p>
    To participate in drawing and trading<br />
    CryptoCanvas on this site, download<br />
    the <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a> Chrome plugin.
  </p>
)

const StatusDisconnected = () =>
  <Alert
    message="Log in to MetaMask"
    description="Ethereum available but not connected"
    type="error"
    showIcon
  />

const StatusConnected = ({ account }) =>
  <div>
    <b>Connected to Ethereum</b><br />
    <span>{cutAddress(account)}</span>
  </div>

class AccountStatus extends React.PureComponent {
  render () {
    return (
      <div className="AccountStatus">
        {
          !this.props.account && this.props.metamaskAvailable &&
          <StatusDisconnected />
        }

        {
          !this.props.account && !this.props.metamaskAvailable &&
          <StatusMetaMaskNotAvailable />
        }

        {
          this.props.account &&
          <div>
            <StatusConnected account={this.props.account} />
            {
              this.props.txStore.transactions.length > 0 &&
              <div>
                <TransactionsModal
                  modal={this.props.modal}
                  transactions={this.props.txStore.transactions}
                  onClear={this.props.txStore.clearTransactions}
                />
                <TransactionsSummary transactions={this.props.txStore.transactions} />
                <span onClick={this.props.modal.show}>Show Transactions</span>
              </div>
            }
          </div>
        }

      </div>
    )
  }
}

AccountStatus.propTypes = {}
AccountStatus.defaultProps = {}

export default withTransactions(withWeb3(withModal(AccountStatus)))
