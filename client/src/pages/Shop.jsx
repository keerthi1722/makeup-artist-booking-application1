import React from "react";
import product1 from "../assets/images/products/product1.jpg";
import product2 from "../assets/images/products/product2.jpg";
import product3 from "../assets/images/products/product3.jpg";
import product4 from "../assets/images/products/product4.jpg";
import product5 from "../assets/images/products/product5.jpg";
import product6 from "../assets/images/products/product6.jpg";
import product7 from "../assets/images/products/product7.jpg";
import product8 from "../assets/images/products/product8.jpg";

function Shop() {
  return (
    <>
      <div id="shop" className="h-auto w-full md:h-auto md:w-full lg:h-auto lg:w-full bg-[#eae9e9]">
        <div
          id="shopBanner"
          className="h-[100px] flex justify-center items-center
          md:h-[150px]
          lg:h-[200px]  lg:flex lg:justify-center lg:items-center"
        >
          <div
            id="info"
            className="merriweather-regular  -mt-[130px] w-[400px] md:mt-[10px] lg:-mt-[0px] lg:w-[600px]"
          >
            <h3 className="lg:font-semibold text-[30px] lg:text-[40px] text-balck text-center">
              Professional care
            </h3>
            <p className="text-[#787676] w-[400px] text-[14px]  lg:w-[650px] lg:text-[20px] text-center lg:-ml-[30px]">
              We have a large number of luxurious products designed especially
              for women. Your stylist will advise which are the best for you.
            </p>
          </div>
        </div>
        <div id="productCard" className="   p-[40px] grid grid-cols-1 gap-[30px] lg:grid lg:grid-cols-1 lg:gap-[40px]">
          <div id="row1" 
          className=" 
          grid grid-cols-1 gap-[30px] 
          md:grid md:grid-cols-2 md:gap-[20px]
          lg:grid lg:grid-cols-4 lg:ml-[40px]">

            <div id="product1" 
            className="bg-white h-[400px] lg:h-[320px] lg:w-[300px] hover:shadow-xl hover:scale-105 hover:shadow-[#6d6a6a]">
              <img
                src={product1}
                alt=""
                className="lg:h-[250px] lg:ml-[20px]"
              />

              <div
                id="info"
                className="text-[20px] p-[10px] font-semibold flex justify-between lg:text-[20px] lg:font-semibold lg:flex lg:justify-between "
              >
                <div id="name" className="lg:ml-[20px]">
                  Facepack
                </div>
                <div id="price" className="lg:mr-[20px]">
                  Rs. 229
                </div>
              </div>
            </div>
            <div id="product2" className="bg-white lg:h-[320px] lg:w-[300px] hover:shadow-xl hover:scale-105 hover:shadow-[#6d6a6a] ">
              <img
                src={product2}
                alt=""
                className="lg:h-[250px] lg:ml-[20px]"
              />

              <div
                id="info"
                className="text-[20px] p-[10px] font-semibold flex justify-between lg:text-[20px] lg:font-semibold lg:flex lg:justify-between "
              >
                <div id="name" className="lg:ml-[20px]">
                  Coconut Oil
                </div>
                <div id="price" className="lg:mr-[20px]">
                  Rs. 200
                </div>
              </div>
            </div>
            <div id="product3" className="bg-white lg:h-[320px] lg:w-[300px] hover:shadow-xl hover:scale-105 hover:shadow-[#6d6a6a]">
              <img
                src={product3}
                alt=""
                className="lg:h-[250px] lg:ml-[20px]"
              />

              <div
                id="info"
                className="text-[20px] p-[10px] font-semibold flex justify-between lg:text-[20px] lg:font-semibold lg:flex lg:justify-between "
              >
                <div id="name" className="lg:ml-[20px]">
                  Hair Straightener
                </div>
                <div id="price" className="lg:mr-[20px]">
                  Rs. 1263
                </div>
              </div>
            </div>
            <div id="product4" className="bg-white lg:h-[320px] lg:w-[300px] hover:shadow-xl hover:scale-105 hover:shadow-[#6d6a6a]">
              <img
                src={product4}
                alt=""
                className="lg:h-[250px] lg:ml-[20px]"
              />

              <div
                id="info"
                className="text-[20px] p-[10px] font-semibold flex justify-between lg:text-[20px] lg:font-semibold lg:flex lg:justify-between "
              >
                <div id="name" className="lg:ml-[20px]">
                  Compact Dryer
                </div>
                <div id="price" className="lg:mr-[20px]">
                  Rs. 649
                </div>
              </div>
            </div>
          </div>
          <div id="row2" 
          className="
          grid grid-cols-1 gap-[30px] 
          md:grid md:grid-cols-2 md:gap-[20px]
          lg:grid lg:grid-cols-4 lg:ml-[40px]">
            <div id="product5" className="bg-white lg:h-[320px] lg:w-[300px] hover:shadow-xl hover:scale-105 hover:shadow-[#6d6a6a]">
              <img
                src={product5}
                alt=""
                className="lg:h-[250px] lg:ml-[20px]"
              />

              <div
                id="info"
                className="text-[20px] p-[10px] font-semibold flex justify-between lg:text-[20px] lg:font-semibold lg:flex lg:justify-between "
              >
                <div id="name" className="lg:ml-[20px]">
                  Hair serums
                </div>
                <div id="price" className="lg:mr-[20px]">
                  Rs. 519
                </div>
              </div>
            </div>
            <div id="product6" className="bg-white lg:h-[320px] lg:w-[300px] hover:shadow-xl hover:scale-105 hover:shadow-[#6d6a6a] ">
              <img
                src={product6}
                alt=""
                className="lg:h-[250px] lg:ml-[20px]"
              />

              <div
                id="info"
                className="text-[20px] p-[10px] font-semibold flex justify-between lg:text-[20px] lg:font-semibold lg:flex lg:justify-between "
              >
                <div id="name" className="lg:ml-[20px]">
                  Face Powders
                </div>
                <div id="price" className="lg:mr-[20px]">
                  Rs. 460
                </div>
              </div>
            </div>
            <div id="product7" className="bg-white lg:h-[320px] lg:w-[300px] hover:shadow-xl hover:scale-105 hover:shadow-[#6d6a6a]">
              <img
                src={product7}
                alt=""
                className="lg:h-[250px] lg:ml-[20px]"
              />

              <div
                id="info"
                className="text-[20px] p-[10px] font-semibold flex justify-between lg:text-[20px] lg:font-semibold lg:flex lg:justify-between "
              >
                <div id="name" className="lg:ml-[20px]">
                  Cosmetics Storage Box
                </div>
                <div id="price" className="lg:mr-[20px]">
                  Rs. 6999
                </div>
              </div>
            </div>
            <div id="product8" className="bg-white lg:h-[320px] lg:w-[300px] hover:shadow-xl hover:scale-105 hover:shadow-[#6d6a6a]">
              <img
                src={product8}
                alt=""
                className="lg:h-[250px] lg:ml-[20px]"
              />

              <div
                id="info"
                className="text-[20px] p-[10px] font-semibold flex justify-between lg:text-[20px] lg:font-semibold lg:flex lg:justify-between "
              >
                <div id="name" className="lg:ml-[20px]">
                  Moisturisers
                </div>
                <div id="price" className="lg:mr-[20px]">
                  Rs. 200
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
