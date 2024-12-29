import React, { createContext, useContext, useReducer } from 'react'

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state,action) => {
    switch(action.type){
        case "ADD" :
            return [...state,{
                id: action.id, 
                name: action.name,
                price : action.price,
                img : action.img,
                qty : action.qty,
                size : action.size
            }]
        case "REMOVE" :
            let newArr = [...state]
            newArr.splice(action.index,1)
            return newArr;
        case "UPDATE" :
            let arr = [...state]
            arr.find((bake,index) => {
                if(bake.id === action.id){
                    console.log(bake.qty, parseInt(action.qty), action.price + bake.price)
                    arr[index] = {...bake, 
                        qty: parseInt(action.qty) + bake.qty,
                        price : action.price + bake.price
                    }
                }
                return arr
            })
            return arr
        case "DROP" :
            let empArr = [];
            return empArr
        default:
            console.log("Error in reducer")    
    }
}

export const CartProvider = ({children}) => {

    const[state,dispatch] = useReducer(reducer,[])
    return(
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    )
}

export const useCart = () => useContext(CartStateContext)
export const useDispatchCart = () => useContext(CartDispatchContext)