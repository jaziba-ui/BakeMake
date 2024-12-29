import React from "react";
import { useDispatchCart, useCart } from "../components/ContextReducer.jsx";
import { remove } from "../assests";

export default function Cart() {
  let data = useCart();
  
  let dispatch = useDispatchCart();
  if (data.length === 0) {
    return (
      <div>
        <img
          className="rounded mx-auto d-block w-25"
          src={remove}
          alt="cake"
          style={{ filter: "brightness(80%)" }}
        />
        <div className="m-3 w-100 text-center fs-3">The Cart is Empty!!</div>
      </div>
    );
  }
  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");
    let response = await fetch("http://localhost:5000/api/orderData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_data: data,
        email: userEmail,
        order_date: new Date().toDateString(),
      }),
    });
    // console.log(data);
    // {console.log("response", response)}
    const json = await response.json();
    // console.log(json);
    if (json.success) {
        // {console.log(userEmail)}
        // {console.log(data)}
      dispatch({
        type: "DROP",
      });
    }
  };

  let totalPrice = data.reduce((total, food) => total + food.price, 0);
  return (
    <div>
      <div
        className="container  m-auto mt-5  table-responsive 
        table-responsive-sm table-responsive-md"
      >
        <table className="table table-hover">
          <thead className="text-sucess fs-4">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Qunatity</th>
              <th scope="col">Option</th>
              <th scope="col">Amount</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
          
            {data.map((food, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td>
                  <button
                    type="button"
                    className="btn p-0"
                    onClick={() => {
                      dispatch({
                        type: "REMOVE",
                        index: index,
                      });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
        {/* console.log(data); */}
          <h1 className="fs-2">Total Price: {totalPrice}/-</h1>
        </div>
        <button className="btn bg-warning mt-5 mb-5" onClick={handleCheckOut} >
          Check Out
        </button>
      </div>
    </div>
  );
}
