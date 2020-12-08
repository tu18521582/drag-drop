import { createContext, useState } from "react";
import './App.css';
import Droppable from "./Droppable";

export const DropContext = createContext({
    transaction: null
})

function App() {
    const [dropContextState, setDropContextState] = useState({
        transaction: null,
        onTransactionEnd: []
    })

    const startTransaction = (payload, onEndTransation) => {
        setDropContextState(prevContextState => ({
            ...prevContextState,
            transaction: payload,
            onTransactionEnd: onEndTransation ? [onEndTransation] : []
        }))
    };

    const endTransaction = (payload) => {
        const onEnd = dropContextState.onTransactionEnd;
        const transactionPayload = dropContextState.transaction;
        onEnd.forEach(trigger => trigger({ transactionPayload, payload }));

        setDropContextState(prevState => ({
            ...prevState,
            transaction: null,
            onTransactionEnd: []
        }))
    }

    return (
        <DropContext.Provider value={[dropContextState, { startTransaction, endTransaction }]}>
            <div className="App">
                <Droppable data={[
                    {
                        id: 4,
                        title: '1a'
                    },
                    {
                        id: 5,
                        title: '1b'
                    },
                    {
                        id: 6,
                        title: '1c'
                    }
                ]} />
                <Droppable data={[
                    {
                        id: 1,
                        title: '2a'
                    },
                    {
                        id: 2,
                        title: '2b'
                    },
                    {
                        id: 3,
                        title: '2c'
                    }
                ]} />
            </div>
        </DropContext.Provider>
    );
}

export default App;
