import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Carousel from "../components/Carousel";
import { cake,muffin,macroon } from "../assests";


export default function Home() {
  const [bakeCat, setBakeCat] = useState([]);
  const [bakeItem, setBakeItem] = useState([]);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    let response = await fetch("http://localhost:5000/api/bakeData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    // console.log(response[0], response[1])

    setBakeItem(response[0]);
    setBakeCat(response[1]);
  };

  useEffect(() => {
    loadData();
  }, []);



  return (
    <div>
    <div>
      <Navbar />
    </div>
    <div>
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-ride="carousel"
        style={{ objectFit: "contain !important" }}
      >
        <div className="carousel-inner" id="carousel">
          <div
            className="carousel-caption d-md-block"
            style={{ zIndex: "10" }}
          >
            <div className="d-flex justify-content-center">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
              />
              {/* <button
                className="btn btn-outline-warning bg-warning-gradient"
                type="submit"
              >
                Search
              </button> */}
            </div>
          </div>

          <div className="carousel-item active">
            <img
              className="d-block w-100"
              src={cake}
              alt="cake"
              style={{ filter: "brightness(50%)" }}
            />
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100"
              src={macroon}
              alt="Second slide"
              style={{ filter: "brightness(50%)" }}
            />
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100"
              src={muffin}
              alt="Third slide"
              style={{ filter: "brightness(50%)" }}
            />
          </div>
        </div>
        <a
          className="carousel-control-prev"
          href="#carouselExampleFade"
          role="button"
          data-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only"></span>
        </a>
        <a
          className="carousel-control-next"
          href="#carouselExampleFade"
          role="button"
          data-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only"></span>
        </a>
      </div>
    </div>
      <div className='container'> {/* boootstrap is mobile first */}
        {
          bakeCat != []
            ? bakeCat.map((data) => {
              return (
                // justify-content-center
                <div className='row mb-3'>
                  <div key={data._id} className='fs-3 m-3'>
                    {data.CategoryName}
                  </div>
                  <hr/>
                  {bakeItem != [] ? bakeItem.filter(
                    (items) => (items.CategoryName === data.CategoryName) && (items.name.toLowerCase().includes(search.toLowerCase())))
                    .map(filterItems => {
                      return (
                        <div key={filterItems._id} className='col-12 col-md-6 col-lg-3'>
                          {/* {console.log(filterItems.name)} */}
                          <Card bakeItems = {filterItems}
                          options={filterItems.options[0]}  ></Card>
                        </div>
                      )
                    }) : <div> No Such Data </div>}
                </div>
              )
            })
            : ""}
      </div>
      <Footer />
    </div>
  )
}
