import React from 'react'
import video from '../assets/images/hair-salon-design-ideas.jpg'
import { RiScissors2Fill } from "react-icons/ri";
import { GiSunglasses, GiBeard } from "react-icons/gi";
import { FaFemale } from "react-icons/fa";
import { MdFace } from "react-icons/md";
import { FaPaintBrush } from "react-icons/fa";
import { GiFemaleVampire }  from "react-icons/gi";
import { BsStars } from "react-icons/bs";

function Aboutus() {
  return (
    <>
      <div
        id="aboutus"
        className="merriweather-regular w-full sm:w-full lg:w-full lg:pt-[20px] "
      >
        <div
          id="aboutShop"
          className=" grid grid-cols-1 m-[20px] sm:grid sm:grid-cols-2 sm:m-[30px] sm:h-[300px] lg:grid lg:grid-cols-2 lg:m-[60px] lg:h-[400px] bg-gray-600 "
        >
          <div id="part1" className="bg-[#f2f2f2]">
            <h3 className="
            text-[20px] font-semibold m-[20px] text-center 
            sm:text-[25px] sm:m-[25px]
            lg:text-[30px] lg:font-semibold lg:m-[40px]">
             Best in town for styling and enhancing your look.
            </h3>
            <p className="
            w-[360px] text-[#787676] font-medium text-[14px] text-center  ml-[15px] mb-[30px] 
            sm:w-[400px] sm:text-[14px] sm:ml-[10px] 
            lg:w-[440px] lg:font-medium lg:text-[18px] lg:ml-[100px] lg:-mt-[20px]">
             We are a professional makeup and beauty organization dedicated to transforming looks and boosting confidence through creative, customized, and high-quality makeup services. Our team of certified makeup artists and stylists brings passion, precision, and professionalism to every brushstroke.
<br />
            </p>
          </div>
          <div
            id="part2"
            className=" bg-[#f2f2f2] flex justify-center items-center lg:flex lg:justify-center lg:items-center"
          >
            <div id="video" className=" w-[300px] mb-[20px] sm:w-[320px] sm:ml-[10px] lg:w-[500px]">
              <img src={video} alt="" />
            </div>
          </div>
        </div>
        {/* Highlights cards removed per request */}
      </div>
    </>
  );
}

export default Aboutus
