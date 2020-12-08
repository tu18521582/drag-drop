import React, { useContext, useRef, useState } from 'react';
import { DropContext } from './App';
import "./style.css";


function DropTarget1(props) {

    const [state, setState] = useState({
        data: [
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
        ],
        dataReceive: [],
        indexReplace: [],
        indexStart: []
    });

    const dropElementRef = useRef();

    const [, { startTransaction, endTransaction }] = useContext(DropContext);

    const dragStart = (event, index) => {
        event.dataTransfer.setData('textA', JSON.stringify(state.data[index]));

        startTransaction(state.data[index], ({ payload, transactionPayload }) => {
            const { target } = payload;
            console.log(!dropElementRef.current.contains(target));
            if (!dropElementRef.current.contains(target)) {
                console.log('ben ngoaii=====================');
                console.log('payload: ', payload, 'transactionPayload', transactionPayload);
                const indexDelete = state.data.findIndex(item => item.id === transactionPayload.id);
                setState(prevState => {
                    prevState.data.splice(indexDelete, 1);
                    return { ...prevState }
                })
            }
            else {
                setState(prevState => {
                    prevState.indexStart = index;
                    return { ...prevState }
                })
                setState(prevState => {
                    console.log("O tronggggggggg");
                    console.log("indexReplace: ", prevState.indexReplace);
                    const nextItems = [...prevState.data];
                    const temp = nextItems[prevState.indexStart];
                    nextItems[prevState.indexStart] = nextItems[prevState.indexReplace];
                    nextItems[prevState.indexReplace] = temp;
                    return { ...prevState, data: [...nextItems] };
                })
            }
        });


    }

    const allowDropFunc = (event) => {
        event.preventDefault();
    }

    const onDropFunc = (event) => {
        event.preventDefault();
        endTransaction({ target: event.target });

        if (event.dataTransfer.getData('textB')) {
            var data = JSON.parse(event.dataTransfer.getData('textB'));

            setState(prevState => {
                prevState.dataReceive = data;
                return { ...prevState }
            });

            setState(prevState => {
                prevState.data.splice(prevState.indexReplace, 0, data);
                return { ...prevState };
            })
        }

    }

    const dragEnd = (event, index) => {
        // setState(prevState => {
        //     const nextItems = [...prevState.data];
        //     const temp = nextItems[prevState.indexStart];
        //     nextItems[prevState.indexStart] = nextItems[prevState.indexReplace];
        //     nextItems[prevState.indexReplace] = temp;
        //     // setTimeout(() => {
        //     //     console.log(nextItems[prevState.indexReplace]);
        //     // }, 1000);
        //     return { ...prevState, data: [...nextItems] };
        // })
    }

    const drag = (event) => {

    }

    /////////////
    const dragOver = (event, index) => {
        event.preventDefault();
        const data = index;
        setState(prevState => ({
            ...prevState,
            indexReplace: data
        }))
    }

    return (
        <div ref={dropElementRef}>
            <h2>Column 1</h2>
            <div className='dropTarget' onDragOver={allowDropFunc} onDrop={onDropFunc}>
                {state.data.map((item, index) => (
                    <p
                        key={index}
                        onDragOver={(event) => dragOver(event, index)}
                        draggable='true'
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

export default DropTarget1;