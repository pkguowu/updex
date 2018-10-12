import validator from 'LoopringJS/ethereum/validator';
import {addHexPrefix, clearHexPrefix, formatAddress, formatKey, toBuffer, toHex, toNumber} from 'LoopringJS/common/formatter';
import {decryptKeystoreToPkey, pkeyToKeystore} from 'LoopringJS/ethereum/keystore';
import {privateToAddress, privateToPublic, publicToAddress, sha3, hashPersonalMessage, ecsign} from 'ethereumjs-util';
import {mnemonictoPrivatekey} from 'LoopringJS/ethereum/mnemonic';
import {generateMnemonic} from 'bip39';
import {trimAll} from 'LoopringJS/common/utils';
import HDKey from 'hdkey';
import EthTransaction from 'ethereumjs-tx';
import {getOrderHash} from 'LoopringJS/relay/rpc/order';
import * as Trezor from 'LoopringJS/ethereum/trezor';
import * as Ledger from 'LoopringJS/ethereum/ledger';
import * as MetaMask from 'LoopringJS/ethereum/metaMask';
import Wallet from 'ethereumjs-wallet';

const wallets = require('LoopringJS/config/wallets.json');
const LoopringWallet = wallets.find(wallet => trimAll(wallet.name).toLowerCase() === 'loopringwallet');
export const path = LoopringWallet.dpath;

export function createWallet ()
{
    return Wallet.generate();
}

/**
 * @description Returns the ethereum address of a given public key.
 * Accepts "Ethereum public keys" and SEC1 encoded keys.
 * @param publicKey Buffer | string
 * @param sanitize bool [sanitize=false] Accept public keys in other formats
 * @returns {string}
 */
export function publicKeytoAddress (publicKey, sanitize)
{
    publicKey = toBuffer(publicKey);
    return formatAddress(publicToAddress(publicKey, sanitize));
}

/**
 *
 * @param publicKey
 * @param chainCode
 * @param pageSize
 * @param pageNum
 * @returns {<Array>}
 */
export function getAddresses ({publicKey, chainCode, pageSize, pageNum})
{
    const addresses = [];
    const hdk = new HDKey();
    hdk.publicKey = publicKey instanceof Buffer ? publicKey : toBuffer(addHexPrefix(publicKey));
    hdk.chainCode = chainCode instanceof Buffer ? chainCode : toBuffer(addHexPrefix(chainCode));
    for (let i = 0; i < pageSize; i++)
    {
        const dkey = hdk.derive(`m/${i + pageSize * pageNum}`);
        addresses.push(publicKeytoAddress(dkey.publicKey, true));
    }
    return addresses;
}

/**
 * @description generate mnemonic
 * @param strength
 * @returns {*}
 */
export function createMnemonic (strength)
{
    return generateMnemonic(strength || 256);
}

export class Account
{
    getAddress ()
    {
        throw Error('unimplemented');
    }

    getUnlockType ()
    {
        throw Error('unimplemented');
    }

    /**
   * @description sign
   * @param hash
   */
    sign (hash)
    {
        throw Error('unimplemented');
    }

    /**
   * @description Returns serialized signed ethereum tx
   * @param rawTx
   * @returns {string}
   */
    signEthereumTx (rawTx)
    {
        throw Error('unimplemented');
    }

    /**
   * @description Returns given order along with r, s, v
   * @param order
   */
    signOrder (order)
    {
        throw Error('unimplemented');
    }

    /**
   * @description Calculates an Ethereum specific signature with: sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))).
   * @param message string
   */
    signMessage (message)
    {
        throw Error('unimplemented');
    }

    sendTransaction (ethNode, signedTx)
    {
        return ethNode.sendRawTransaction(signedTx);
    }
}

export class AddressAccount extends Account
{
  constructor (address)
  {
    super();
    try
    {
      validator.validate({value: address, type: 'ETH_ADDRESS'});
    } catch (e)
    {
      throw new Error('Invalid ETH address');
    }
    this.address = address
  }

  async getAddress ()
  {
    return this.address
  }

  getUnlockType ()
  {
    return 'address'
  }

  async signMessage (message)
  {
    //TODO
  }

  async signEthereumTx (rawTx)
  {
    //TODO
  }

  async signOrder (order)
  {
    //TODO
  }
}

export class LooprAccount extends Account
{
  constructor (address)
  {
    super();
    this.address = address
  }

  async getAddress ()
  {
    return this.address
  }

  getUnlockType ()
  {
    return 'loopr'
  }

  async signMessage (message)
  {
    //TODO
  }

  async signEthereumTx (rawTx)
  {
    //TODO
  }

  async signOrder (order)
  {
    //TODO
  }
}

export class UpWalletAccount extends Account
{
  constructor (address)
  {
    super();
    this.address = address
  }

  async getAddress ()
  {
    return this.address
  }

  getUnlockType ()
  {
    return 'upWallet'
  }

  async signMessage (message)
  {
    //TODO
  }

  async signEthereumTx (rawTx)
  {
    //TODO
  }

  async signOrder (order)
  {
    //TODO
  }
}

export class LedgerAccount extends Account
{
    constructor (ledger, dpath)
    {
        super();
        this.ledger = ledger;
        this.dpath = dpath;
    }

    async getAddress ()
    {
        const result = await Ledger.getXPubKey(this.dpath, this.ledger);
        if (result.error)
        {
            throw new Error(result.error.message);
        }
        else
        {
            return formatAddress(result.result.address);
        }
    }

    getUnlockType ()
    {
        return 'ledger'
    }

    async signMessage (message)
    {
        const hash = clearHexPrefix(toHex(sha3(message)));
        const result = await Ledger.signMessage(this.dpath, hash, this.ledger);
        if (result.error)
        {
            throw new Error(result.error.message);
        }
        else
        {
            return result.result;
        }
    }

    async signEthereumTx (rawTx)
    {
        const result = await Ledger.signEthereumTx(this.dpath, rawTx, this.ledger);
        if (result.error)
        {
            throw new Error(result.error.message);
        }
        else
        {
            return result.result;
        }
    }

    async signOrder (order)
    {
        const hash = getOrderHash(order);
        const result = await Ledger.signMessage(this.dpath, clearHexPrefix(toHex(hash)), this.ledger);
        if (result.error)
        {
            throw new Error(result.error.message);
        }
        else
        {
            return {...order, ...result.result};
        }
    }
}

export class MetaMaskAccount extends Account
{
    constructor (web3)
    {
        super();
        if (web3 && web3.eth.accounts[0])
        {
            this.web3 = web3;
            this.account = this.web3.eth.accounts[0];
        }
    }

    getAddress ()
    {
        if (this.web3 && this.web3.eth.accounts[0]) return this.web3.eth.accounts[0];
        else throw new Error('Not found MetaMask');
    }

    getUnlockType ()
    {
        return 'metaMask'
    }

    async sign (hash)
    {
        const result = await MetaMask.sign(this.web3, this.account, hash);
        if (!result.error)
        {
            return result.result;
        }
        else
        {
            throw new Error(result.error.message);
        }
    }

    async signMessage (message)
    {
        const result = await MetaMask.signMessage(this.web3, this.account, message);
        if (!result.error)
        {
            return result.result;
        }
        else
        {
            throw new Error(result.error.message);
        }
    }

    async signEthereumTx (rawTx)
    {
        const result = await MetaMask.signEthereumTx(this.web3, this.account, rawTx);
        if (!result.error)
        {
            return result.result;
        }
        else
        {
            throw new Error(result.error.message);
        }
    }

    async signOrder (order)
    {
        const hash = toHex(hashPersonalMessage(getOrderHash(order)));
        const result = await MetaMask.sign(this.web3, this.account, hash);
        if (!result.error)
        {
            return {...order, ...result.result};
        }
        else
        {
            throw new Error(result.error.message);
        }
    }
}