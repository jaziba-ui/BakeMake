import React, { useEffect, useState } from "react";

export default function Order() {

  const [orderData, setOrderData] = useState({});

  const fetchMyOrder = async () => {
    // console.log(localStorage.getItem("userEmail"));
    const userEmail =  localStorage.getItem("userEmail");
    let response = await fetch("http://localhost:5000/api/myOrderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        email: userEmail,
        }),
      })
    .then(async(res) => {
      let json = await res.json();
      await setOrderData(json);
      console.log("json",json)
    });
    // const json = await response.json();
    console.log(userEmail)
    console.log("response msg: ",response)
  };
  
  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    // <div className="m-3 w-100 text-center fs-3">The Cart is Empty!!</div>
    <div className="container">
      <div className="row">
        {orderData != {}
          ? Array(orderData).map((data) => {
              return data.orderData
                ? data.orderData.order_data
                    .slice(0)
                    .reverse()
                    .map((item) => {
                      return item.map((arrayData) => {
                        return (
                          <div>
                            {arrayData.order_date ? (
                              <div className="m-auto mt-5">
                                {(data = arrayData.order_date)}
                                {console.log(data)}
                                <hr />
                              </div>
                            ) : (
                              <div className="col-12 col-md-6 col-lg-3">
                                <div
                                  className="card mt-3"
                                  style={{ width: "16rem", maxHeight: "360px" }}
                                >
                                  <img
                                    src={arrayData.img}
                                    className="card-img-top"
                                    alt="..."
                                    style={{
                                      height: "120px",
                                      objectFit: "fill",
                                    }}
                                  />
                                  <div className="card-body">
                                    <h5 className="card-title">
                                      {arrayData.name}
                                    </h5>
                                    <div
                                      className="container w-100 p-0"
                                      style={{ height: "38px" }}
                                    >
                                      <span className="m-1">
                                        {arrayData.qty}
                                      </span>
                                      <span className="m-1">
                                        {arrayData.size}
                                      </span>
                                      <span className="m-1">{data}</span>
                                      <div className=" d-inline ms-2 h-100 w-20 fs-5">
                                        ₹{arrayData.price}/-
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })
                : "";
            })
          : 
          <div className="m-3 w-100 text-center fs-3">The Cart is Empty!!</div>
          }
      </div>
    </div>
  );
}
