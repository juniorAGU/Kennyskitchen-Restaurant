import React from 'react'
import { createContext,useContext,useState, useReducer, useEffect } from 'react'
import { AdminContext } from '../Context/AdminContext'




const initialState = {
  cart: [],
  totalQauntity: 0,
  totalPrice: 0
}
const CartContext = createContext()

const reducer = (state,action)=>{
  
    switch(action.type){
      case "ADD_CART":
        
        const prod = action.payload;
        
        const filt = state.cart.find(item => item.id === prod.id)
        if(filt){
          const updated = state.cart.map(item => item.id === prod.id
            ? {...item, cartquantity: item.cartquantity + 1, subtotal: (item.price  * (item.cartquantity + 1)) } : item
          )

          const newPrice = updated.reduce((sum, item) => sum + (item.price  *  item.cartquantity),0)
         
          return{...state, 
            cart: updated,
            totalQauntity: state.totalQauntity + 1,
            totalPrice: newPrice
            }
        }else{
          const newdata = {
            id: prod.id,
            name: prod.name,
            price: prod.price,
            image: prod.image,
            cartquantity: 1,
            quantity: prod.quantity,
            subtotal: prod.price

          }

          const newPrice = state.totalPrice + prod.price

          
          return{...state, 
            cart: [...state.cart,newdata],
            totalQauntity: state.totalQauntity + 1,
            totalPrice: newPrice
          }
        }
      case "REMOVE":
        const  produ1  = action.payload;
        const access = state.cart.findIndex(p => p.id === produ1.id)
        if(access !== -1){
           const update1 = [...state.cart]
           update1.splice(access, 1)
           const newprice = update1.reduce((sum,item) => sum + (item.price * item.cartquantity),0)
            return {...state, cart: update1, totalQauntity: state.totalQauntity - update1.cartquantity, totalPrice: newprice}
         }else{
            return state
         }
      case "INCREASE" :
         
        const item = action.payload;
        const filtitem = state.cart.find(p => p.id === item.id)
        if(filtitem){
            const update2 = state.cart.map(items => items.id === item.id ? {...items, cartquantity: items.cartquantity + 1} : items)
            const newprice = update2.reduce((sum,itemes) => sum + (itemes.price * itemes.cartquantity),0)
            return{...state,
                cart: update2,
                totalQauntity: state.totalQauntity + 1,
                totalPrice: newprice
            }
        }else{
            return state
        }
      case "DECREASE" :
      
        const item2 = action.payload;
        const filtitem2 = state.cart.find(p => p.id === item2.id)
        if(filtitem2){
            if(filtitem2.cartquantity === 1){
                const index = state.cart.findIndex(p => p.id === item2.id);
                const newupdate = [...state.cart]
                newupdate.splice(index,1)
                const newprice = newupdate.reduce((sum,itemes) => sum + (itemes.price * itemes.cartquantity),0)

                return{...state,cart: newupdate, totalQauntity: state.totalQauntity - 1, totalPrice: newprice}

            }else{
                const update3 = state.cart.map(items => items.id === item2.id ? {...items, cartquantity: items.cartquantity - 1} : items)
                const newprice = update3.reduce((sum,itemes) => sum + (itemes.price * itemes.cartquantity),0)
            
            return{...state,
                cart: update3,
                totalQauntity: state.totalQauntity - 1,
                totalPrice: newprice
                }
            }
            
        }else{
            return state
        }

      case "RESTORE_CART":
      return action.payload 

      case "RESET":
        return initialState
      default:
        return state
    }

  }

function CartContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
    const [isLoading, setIsLoading] = useState(true) 
    const [message, setMessage] = useState(null);
  
  useEffect(()=>{
   const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        const restoredCart = JSON.parse(storedCart)
        dispatch({ type: "RESTORE_CART", payload: restoredCart })
        console.log("✅ Cart loaded from localStorage:", restoredCart)
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }
    setIsLoading(false)  
    console.log("Loading complete")

  },[])
   

  useEffect(() => {
     if (!isLoading) {  
      localStorage.setItem("cart", JSON.stringify(state))
    }
  },[state,isLoading])

  const showMessage = (msg,type) => {
    setMessage( { msg,type})
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }
 


  const addtoCart = (prod) => {
    const existQuantity = prod.quantity || 0;
    const findit = state.cart.find(item => item.id === prod.id)
    const setQuant = findit ? findit.cartquantity : 0 ;
    if(setQuant + 1 > existQuantity){
       showMessage(`sorry only ${existQuantity} available currently !!!`, "failed")
      return
    }
     dispatch({
       type: "ADD_CART",
       payload: prod
     })
     showMessage(`${prod.name} successfully added to cart!`, "success")
     return true

  }
  const increaseCart = (item) => {
    console.log(item)
    const existQuantity = item.quantity || 0;
    const findit = state.cart.find(cartitem => cartitem.id === item.id)
    const setQuant = findit ? findit.cartquantity : 0 ;
    if(setQuant + 1 > existQuantity){
      showMessage(`sorry only ${existQuantity} available currently !!!`, "failed")
      return
    }
    
    dispatch({
        type: "INCREASE",
        payload: item
    })
  }
  const decreaseCart = (item) => {
    console.log(item)
    dispatch({
        type: "DECREASE",
        payload: item
    })
  }

  const removeCart = (id) => {
    dispatch({
      type: "REMOVE",
      payload: id
    })
  }
  


const values = {
    state,
    addtoCart,
    removeCart,
    increaseCart,
    decreaseCart,
    message,
    showMessage,
    clearCart: () => dispatch({ type: "RESET" })
}
  return (
    <CartContext.Provider value={values}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}

export default CartContextProvider