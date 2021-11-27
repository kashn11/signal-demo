// export interface Ratchet<T> {
//     rootKey: T
//     ephemeralKeyPair?: KeyPairType<T>
//     lastRemoteEphemeralKey: T
//     previousCounter: number
//     added?: number //timestamp
// }
import PubSub from 'pubsub-js'

import React, { useState, useEffect } from "react";
import Key from "./Key.js"
import {abToS} from "../util.tsx"
import FancyChain from "./FancyChain.js"

export default function Ratchet(props){
    const [currentShowingChain, setCurrentShowingChain] = useState(null);
    const [isChainShowing, setIsChainShowing] = useState(false);
    const [selectedRootKey, setSelectedRootKey] = useState(null); 
    console.log('ratchet renders with ', props.ratchet); 

    var rootKeyFlowElements = props.ratchet.rootKeyHistory.map((item, index) => {
        return {
                    id: "root" + props.clientName + abToS(item), 
                    data: {label: <Key key={item} desc={index} keyArray={item}></Key>, rootkey: item}, 
                    position: {x: 0, y: 100 + index*40}, 
                    style: {
                        width: 200,
                        height: 60
                    }
                }
        }
    ); 

    // var chainFlowElements = Object.entries(props.ratchet.chainHistory).map(([rootKey, v], index) => {
    //     return {
    //         id: abToS(rootKey) + props.clientName, 
    //         data: {label: <Key key={v.chainKey.key} desc={""} keyArray={v.chainKey.key} />}, 
    //         position: {x: 200, y: 100 + index*40}, 
    //         style: {
    //             width: 200,
    //             height: 100,
    //         }
    //     }
    // }); 

    var chainFlowElements =[]; 

    var edges = []; 
    for (var i = 0 ; i < rootKeyFlowElements.length - 1; i++){
        edges.push(
        {
            id: 'edges-' + i.toString() + "-" + (i+1).toString(),
            source:  rootKeyFlowElements[i].id, 
            target: rootKeyFlowElements[i+1].id, 
            type: 'custom',
            arrowHeadType: 'arrowclosed',
        })
    }


    function onRootKeyClick(rootKey) {
        const rootKeyString = abToS(rootKey); 
        console.log("rootKey clicked", rootKeyString)
        setSelectedRootKey(rootKey); 
        const chain = props.chains[props.ratchet.rootKeyToEphemeralKeyMapping[rootKeyString]]; 
        if (chain !== undefined){
            console.log('successly found chain!')
            setCurrentShowingChain(chain); 
            setIsChainShowing(true); 
        } else {
            console.log('no chain!')
            setCurrentShowingChain(null); 
        }
        PubSub.publish('discoverTopic', 'rootKey');
    }

    const chainInfoPanel = () => {
        if (isChainShowing && currentShowingChain !== null) {
            return (
                <FancyChain chain={currentShowingChain}/>
            )
        }
        else if (isChainShowing){
            return (<div>No chain associated with this root key!</div>)
        }
        return (<div>Click on a root key to show the chain</div>)
    }

    return (
        <>
            <h2>Root Keys</h2>
            {props.ratchet.rootKeyHistory.map((item, index) => { return (
                <Key selected={selectedRootKey === item} key={index} desc={index} keyArray={item} onClick={() => onRootKeyClick(item)}></Key>
                )
            })}
            {chainInfoPanel()}
        </>
    )
}