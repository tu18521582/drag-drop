import React, { useContext, useRef, useState } from 'react';
import { DropContext } from './App';
import "./style.css";
DropTarget2.propTypes = {

};

function DropTarget2(props) {

    const [state, setState] = useState({
        data: [
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
        ],
        signalReceived: [],
        dataReceive: [],
        indexReplace: [],
        indexStart: [],
        indexEnd: [],
    });

    const dropElementRef = useRef();

    const [, { startTransaction, endTransaction }] = useContext(DropContext);


    const allowDropFunc = (event) => {
        event.preventDefault();
    }

    const onDropFunc = (event) => {
        event.preventDefault();
        endTransaction({ target: event.target });
        if (event.dataTransfer.getData('textA')) {
            var data = JSON.parse(event.dataTransfer.getData('textA'));

            setState(prevState => {
                prevState.signalReceived = true;
                return { ...prevState }
            });

            setState(prevState => {
                prevState.dataReceive = data;
                return { ...prevState }
            });

            setState(prevState => {
                prevState.data.splice(prevState.indexReplace, 0, data);
                return { ...prevState };
            });

            setState(prevState => {
                prevState.signalReceived = false;
                return { ...prevState }
            });
        }

        else {
            console.log('khong co data truyen tu target 1');
        }
    }

    const dragStart = (event, index) => {
        event.dataTransfer.setData('textB', JSON.stringify(state.data[index]));

        startTransaction(state.data[index], ({ payload, transactionPayload }) => {
            if (!dropElementRef.current.contains(payload.target)) {
                console.log('ben ngoaii=====================');
                const { target } = payload;
                console.log('dropElementRef: ', dropElementRef);
                console.log('target: ', target.parentNode, 'transactionPayload', transactionPayload);
                setTimeout(() => {
                    console.log(dropElementRef.current === target.parentNode);
                }, 1000);
                const indexDelete = state.data.findIndex(item => item.id === transactionPayload.id);
                setState(prevState => {
                    prevState.data.splice(indexDelete, 1);
                    return { ...prevState }
                })
            }
        });

        setState(prevState => {
            prevState.indexStart = index;
            return { ...prevState }
        })
    }


    const dragEnd = (event, index) => {
        setState(prevState => {
            const nextItems = [...prevState.data];
            const temp = nextItems[prevState.indexStart];
            nextItems[prevState.indexStart] = nextItems[prevState.indexReplace];
            nextItems[prevState.indexReplace] = temp;

            return { ...prevState, data: [...nextItems] };
        })
    }

    const dragOver = (event, index) => {
        console.log('index drag over target 2: ', index);
        setState(prevState => {
            prevState.indexReplace = index;
            return { ...prevState };
        })
    }

    const drag = (event) => {

    }

    console.log('ref: ', dropElementRef);

    return (
        <div ref={dropElementRef}>
            <h2>Column 2</h2>
            <div className='dropTarget' onDragOver={allowDropFunc} onDrop={onDropFunc}>
                {state.data.map((item, index) => (
                    <p
                        key={item.id}
                        draggable='true'
                        onDragOver={(event) => dragOver(event, index)}
                        onDragStart={(event) => dragStart(event, index)}
                        onDragEnd={(event) => dragEnd(event, index)}
                        onDrag={drag}
                    >
                        {item.title}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default DropTarget2;