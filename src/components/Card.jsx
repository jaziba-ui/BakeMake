import React, { useEffect, useRef, useState } from 'react'
import { useDispatchCart, useCart } from './ContextReducer'

export default function Card(props) {

  const priceRef = useRef();
  let dispatch = useDispatchCart()
  let options = props.options
  let priceOpt = Object.keys(options)
  let data = useCart()
  // let bakeItems = props.bakeItems
  const [qty,setQty] =  useState(1)
  const [size,setSize] =  useState("")

  const handleAddToCart = async () => {
    let bake = []
    for(const item of data){
      if(item.id === props.bakeItems._id){
        bake = item;
        break;
      }
    }
     if(bake != []){
      if(bake.size == size){
        await dispatch({
          type : "UPDATE",
          id: props.bakeItems._id,
          price : finalPrice,
          qty : qty,
        })
        return
      }
      else if(bake.size != size){
        await dispatch({
          type : "ADD", 
          id: props.bakeItems._id,
          name : props.bakeItems.name,
          price : finalPrice,
          qty : qty,
          size : size,
          img : props.bakeItems.img
        })
        return
      }
      return
     }
     await dispatch({
      type : "ADD", 
      id: props.bakeItems._id,
      name : props.bakeItems.name,
      price : finalPrice,
      qty : qty,
      size : size,
      img : props.bakeItems.img
    })
    // await console.log(data)
  }

  let finalPrice = qty * parseInt(options[size]);
  useEffect(() => {
    setSize(priceRef.current.value)
  },[])

  return (
    <div>
        <div >
        <div className="card m-3" style={{"width" : "18rem","maxHeight" : "500px"}}>
          <img className="card-img-top" src={props.bakeItems.img}  style={{height: "250px", objectFit: "fill"}}/>
          <div className="card-body">
            <h5 className="card-title">{props.bakeItems.name}</h5>
            {/* <p className="card-text">This is some Important Text</p> */}
            <div className="container w-100 p-0" >
                <select className="m-2 btn btn-warning bg-gradient rounded" onChange={(e) => setQty(e.target.value)}>
                    {Array.from(Array(6),(e,i)=>{
                        return(
                            <option key={i+1} value={i+1}>{i+1}</option>
                        )
                    })}
                </select>
                <select className="m-2 btn btn-warning bg-gradient rounded" ref={priceRef}
                onChange={(e) => setSize(e.target.value)}>
                    {
                      priceOpt.map((i) => {
                        return <option key={i} value={i}>{i}</option>
                      })
                    }
                </select>
                <div className="m-2 d-inline h-100 fs-7">&#8377;{finalPrice}/-</div>
                </div>
                {/* <hr /> */}
            {/* <button></button> */}
          <hr/>
          <button className='btn btn-outline-warning justify-content ms-2 ' data-toggle="button" aria-pressed="false" autocomplete="off"
           onClick={handleAddToCart}>Add to Cart</button>
        </div>
        </div>
      </div>
    </div>
  )
}
