import React, { useContext, useRef, useState } from 'react';
import { DropContext } from './App';
import "./style.css";


function Droppable(props) {
    const { data } = props;
    const [state, setState] = useState({
        data: data || [],
        dataReceive: [],
        indexReplace: [],
        indexStart: [],
        itemStart: [],
        targetStart: {},
        isInside: false
    });

    const dropElementRef = useRef();
    var isDropBlank = true;
    const [, { startTransaction, endTransaction }] = useContext(DropContext);
    const dragStart = (event, index) => {
        event.dataTransfer.setData('text', JSON.stringify(state.data[index]));
        setState(prevState => {
            prevState.indexStart = index;
            prevState.itemStart = prevState.data[index];
            return { ...prevState }
        })
        startTransaction(state.data[index], ({ payload, transactionPayload }) => {
            const { target } = payload;
            if (!dropElementRef.current.contains(target)) {
                const indexDelete = state.data.findIndex(item => item.id === transactionPayload.id);
                setState(prevState => {
                    prevState.isInside = false;
                    prevState.data.splice(indexDelete, 1);
                    return { ...prevState }
                })
            }
            else {
                setState(prevState => {
                    prevState.isInside = true;
                    return { ...prevState };
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
        if (event.dataTransfer.getData('text')) {
            var data = JSON.parse(event.dataTransfer.getData('text'));
            let found = state.data.includes(state.itemStart);
            if (!found) {
                if (isDropBlank === false) {
                    state.data.splice(state.indexReplace, 0, data);
                }
                else {
                    state.data.push(data);
                }
            }
            else if (found) {
                const nextItems = state.data;
                const temp = nextItems[state.indexStart];
                if (isDropBlank === true) {
                    const lastIndex = nextItems.length - 1;
                    nextItems[state.indexStart] = nextItems[lastIndex];
                    nextItems[lastIndex] = temp;
                }
                else {
                    const idxReplace = state.indexReplace;
                    nextItems[state.indexStart] = nextItems[idxReplace];
                    nextItems[idxReplace] = temp;
                }
                setState(prevState => {
                    prevState.itemStart = {};
                    return { ...prevState, data: [...nextItems] };
                })
            }
        }

    }

    const dragOver = (index) => {
        return (event) => {
            event.preventDefault();
            setState(prevState => ({
                ...prevState,
                indexReplace: index
            }))
        }

    }

    const onDropItem = () => {
        isDropBlank = false;
    }

    return (
        <div ref={dropElementRef}>
            <h2>Column 1</h2>
            <div className='dropTarget' onDragOver={allowDropFunc} onDrop={onDropFunc}>
                {state.data.map((item, index) => (
                    <p
                        onDrop={onDropItem}
                        key={item.id}
                        onDragOver={dragOver(index)}
                        draggable='true'
                        onDragStart={(event) => dragStart(event, index)}
                    >
                        {item.title}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default Droppable
    ;