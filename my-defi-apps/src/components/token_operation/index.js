import { localProdiver } from "../wallet"
import { ethers } from "ethers-v5"
import TokenABI from "../../frontend/contracts/SimpleDeFiToken.json"
import TokenAddress from "../../frontend/contracts/SimpleDeFiToken-address.json"
import { useState, useEffect, useCallback } from "react"
import {
    Grid, GridRow, GridColumn, Header, Form, FormGroup, Button, FormInput,
    MessageHeader, Message
} from "semantic-ui-react"
import { localProvider } from "../wallet"
import { useWeb3React } from "@web3-react/core"

const TokenOperation = () => {
    const [totalSupply, setTotalSupply] = useState(0)
    const [yourBalance, setYourBalance] = useState(0)
    const { active, account, library } = useWeb3React()

    const [addressNormal, setAddressNormal] = useState('')
    const [amountNormal, setAmountNormal] = useState(0)
    const [addressBurn, setAddressBurn] = useState('')
    const [amountBurn, setAmountBurn] = useState(0)
    const [showMsg, setShowMsg] = useState(false)
    const [msgHeader, setMsgHeader] = useState('')
    const [msgContent, setMsgContent] = useState('')

    const getTotalSupply = async () => {
        try {
            const contract = new ethers.Contract(TokenAddress.address,
                TokenABI.abi, localProvider)
            const response = await contract.totalSupply()
            setTotalSupply(ethers.utils.formatEther(response))
        } catch (err) {
            console.error(err)
        }
    }

    const getYourBalance = async () => {
        if (!active) {
            return
        }

        try {
            let contract = new ethers.Contract(TokenAddress.address,
                TokenABI.abi, library.getSigner())
            const response = await contract.balanceOf(account)
            setYourBalance(ethers.utils.formatEther(response))
        } catch (err) {
            console.error(err)
        }
    }

    const handleTransfer = async (autoBurn) => {
        if (!active) {
            setShowMsg(true)
            setMsgHeader("wallet not connet")
            setMsgContent("you need to connect wallet for transaction!")
            return
        }

        try {
            const type = autoBurn ? 'auto burn' : 'normal'
            const address = autoBurn ? addressBurn : addressNormal
            const amount = autoBurn ? amountBurn : amountNormal

            if (!ethers.utils.isAddress(address)) {
                setShowMsg(true)
                setMsgHeader("Address invalid")
                setMsgContent(`The recipient address of ${address} is invalid!`)
                return
            }
            if (isNaN(amount)) {
                setShowMsg(true)
                setMsgHeader("Amount invalid")
                setMsgContent(`The amount for ${amount} transfer is invalid!`)
                return
            }

            console.log("transfer with type: ", type)

            let contract = new ethers.Contract(TokenAddress.address,
                TokenABI.abi, library.getSigner())
            const tx = autoBurn ? await contract.transferWithAutoBurn(address,
                ethers.utils.parseUnits(amountBurn, 'ether')) :
                await contract.transfer(address,
                    ethers.utils.parseUnits(amountNormal, 'ether'))

            if (autoBurn) {
                console.log("auto burn transfer")
            } else {
                console.log("normal transfer")
            }
            // console.log("tx is : ", tx)
            // /*
            // when we come to here, it dosen't mean the transfer is complete, it only
            // means the transaction is created on the chain, it may take for a while for
            // the transaction to complete and the given address receive the tokens,
            // in order to wait for the transaction to complete, we need to wait on tx
            // */
            await tx.wait()

            console.log("transaction complete!")

            setShowMsg(true)
            setMsgHeader("transaction complete")
            setMsgContent("given amount of tokens are transfered to given address")

            if (autoBurn) {
                setAddressBurn('')
                setAmountBurn(0)
            } else {
                setAddressNormal('')
                setAmountNormal(0)
            }

            getTotalSupply()
            getYourBalance()
        } catch (err) {
            console.error(err)
            setShowMsg(true)
            setMsgHeader("transaction fail")
            setMsgContent(err)
        }
    }

    useEffect(() => {
        getTotalSupply()
        getYourBalance()
    }, [account])

    return (
        <Grid>
            {
                showMsg == true && <Message positive
                    header={msgHeader}
                    content={msgContent}
                >
                </Message>
            }
            <GridRow>
                <GridColumn width={12}>
                    <Header as='h1'>Simple DeFi Token</Header>
                </GridColumn>
            </GridRow>
            <GridRow>
                <GridColumn width={6}>
                    <Header as='h2'>Total supply</Header>
                    <Header as='h3'>{totalSupply}</Header>
                </GridColumn >

                <GridColumn widht={6}>
                    <Header as='h2'>Your balance</Header>
                    <Header as='h3'>{yourBalance}</Header>
                </GridColumn>
            </GridRow>

            <GridRow>
                <GridColumn width={12}>
                    <Form>
                        <FormGroup widths='equal'>
                            <FormInput fluid
                                label="Recipient address"
                                placeholder="Please Enter Recipient's address"
                                onChange={(e) => {
                                    setAddressNormal(e.target.value)
                                }}
                                value={addressNormal}
                            >
                            </FormInput>
                            <FormInput
                                fluid
                                label="Transfer amount"
                                placeholder="Please Enter Amount To Transfer"
                                onChange={(e) => {
                                    setAmountNormal(e.target.value)
                                }}
                                value={amountNormal}
                            >
                            </FormInput>
                            <Button primary onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTransfer(false)
                                console.log("transfer normal")
                            }}>Normal Transfer</Button>
                        </FormGroup>

                        <FormGroup widths='equal'>
                            <FormInput fluid
                                label="Burn Recipient address"
                                placeholder="Please Enter Burn Recipient's address"
                                onChange={(e) => {
                                    setAddressBurn(e.target.value)
                                }}
                                value={addressBurn}
                            >
                            </FormInput>
                            <FormInput
                                fluid
                                label="Burn Transfer amount"
                                placeholder="Please Enter Burn Amount To Transfer (10% of total will be burned)"
                                onChange={(e) => {
                                    setAmountBurn(e.target.value)
                                }}
                                value={amountBurn}
                            >
                            </FormInput>
                            <Button primary onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("transfer burn")
                                handleTransfer(true)
                            }}>Burn Transfer</Button>
                        </FormGroup>

                    </Form>
                </GridColumn>
            </GridRow>
        </Grid>
    )
}

export default TokenOperation