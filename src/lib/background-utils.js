import { networks, DEFAULT_NETWORK } from '../popup/utils/constants'
import Universal from '@aeternity/aepp-sdk/es/ae/universal';
import { setContractInstance, contractCall, parseFromStorage } from '../popup/utils/helper'
import Node from '@aeternity/aepp-sdk/es/node'


let sdk;
let controller;

export const setController = (contr) => {
    controller = contr;
}

export const getActiveAccount  = () => {
    return new Promise((resolve, rejet) => {
        browser.storage.local.get('userAccount').then((data) => {
            if (data.userAccount && data.userAccount.hasOwnProperty('publicKey')) {
                browser.storage.local.get('subaccounts').then((subaccounts) => {
                    browser.storage.local.get('activeAccount').then((active) => {
                        let activeIdx = 0
                        if(active.hasOwnProperty("activeAccount")) {
                            activeIdx = active.activeAccount
                        }
                        let address = subaccounts.subaccounts[activeIdx].publicKey
                        resolve({ account: { publicKey: address }, activeAccount: activeIdx })
                    })
                })
            } else {
                resolve(false)
            }
        })
    })
}

export const getActiveNetwork = async () => {
    const { activeNetwork } = await browser.storage.local.get('activeNetwork')
    return networks[activeNetwork ? activeNetwork : DEFAULT_NETWORK]
}

export const getSDK = async (keypair = {}) => {
    if(!sdk) {
        try {
            let network = await getActiveNetwork();
            const node = await Node({ url: network.internalUrl, internalUrl: network.internalUrl })
            sdk = await Universal({
                nodes: [
                    { name: DEFAULT_NETWORK, instance: node },
                ],
                networkId: network.networkId, 
                nativeMode: true,
                compilerUrl: network.compilerUrl
            })
        } catch(e) {
        } 
    } 

    return sdk
    
}

export const contractCallStatic = async ({ tx, callType }) => {
    
    return new Promise(async (resolve, reject) => {
        try {
            let { activeAccount, account } = await getActiveAccount();
            //controller.isLoggedIn() &&
            if( typeof callType != "undefined" && callType == 'static' && account ) {

                // let keypair = parseFromStorage(await controller.getKeypair({ activeAccount, account }));
                let sdk = await getSDK();
                let contractInstance = await setContractInstance(tx, sdk, tx.address)
                let call = await contractCall({ instance:contractInstance, method:tx.method, params:[...tx.params, tx.options] })
                if(call) {
                    resolve(call)
                } else {
                    reject("Contract call failed")
                }
            } else if(!controller.isLoggedIn() && typeof callType != "undefined" && callType == 'static') { 
                reject("You need to unlock the wallet first")
            }
        } catch(e) {
            reject(e)
        }
    })
}