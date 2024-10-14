import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../wallet";
import { Form, FormField, Button, FormGroup, Input } from 'semantic-ui-react'
import TokenOperation from "../token_operation";
const Layout = () => {
    const { active, account, activate, deactivate } = useWeb3React()
    const connect = async () => {
        try {
            await activate(injectedConnector)
        } catch (err) {
            console.err(err)
        }
    }

    const disconnect = async () => {
        try {
            await deactivate()
        } catch (err) {
            console.err(err)
        }
    }

    return (
        <Form>
            <FormGroup widths='equal'>
                {
                    !active &&
                    <Button primary onClick={() => {
                        connect()
                    }}>
                        Connect
                    </Button>
                }

                {
                    active && <Button primary onClick={() => {
                        disconnect()
                    }}>
                        DisConnect
                    </Button>
                }

                <FormField>
                    {active && <input value={account}></input>}
                </FormField>
            </FormGroup>

            <FormGroup widths='equal'>
                <FormField>
                    <TokenOperation></TokenOperation>
                </FormField>
            </FormGroup>
        </Form>
    )
}

export default Layout