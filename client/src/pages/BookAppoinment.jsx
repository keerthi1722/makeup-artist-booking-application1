import React, { useState, useEffect } from "react";
import Navbar from "../componets/Navbar";
import blog2 from "../assets/images/bookingBanner.jpg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { services } from "../constants/serviceData";
import AdminNav from "../componets/AdminNav";

function BookAppoinment() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    selectedServices: [],
    selectedSubServices: [],
    staff: "",
    date: "",
    totalPrice: 0,
  });

  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await fetch("http://localhost:5000/appoinment");
        const data = await response.json();
        setBookedDates(data.bookedDates);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };
    fetchBookedDates();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleDateChange = (date) => {
    setUser({ ...user, date: date.toISOString().split("T")[0] });
  };

  //conenct backend to frontend

  const PostData = async (e) => {
    e.preventDefault();
    const { name, email, selectedServices, selectedSubServices, staff, date  , totalPrice} =
      user;

    try {
      const res = await fetch("http://localhost:5000/appoinment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          selectedServices,
          selectedSubServices,
          staff,
          date,
          totalPrice
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.status !== 200) {
        window.alert(data.message || "Invalid data");
      } else {
        window.alert("Appointment successfully created");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("An error occurred. Please try again later.");
    }
  };


  //data booking 

  const isDateBooked = (date) => {
    if (!bookedDates || bookedDates.length === 0) {
      return false; // If there are no booked dates, allow all dates to be selectable
    }
    return bookedDates.includes(date.toISOString().split("T")[0]);
  };
  

  const [selectedService, setSelectedService] = useState("");
  const [selectedSubServices, setSelectedSubServices] = useState([]);

  const handleServiceChange = (e) => {
    const serviceName = e.target.value;
    const checked = e.target.checked;

    if (checked) {
      setSelectedService(serviceName);
    } else {
      if (selectedService === serviceName) {
        setSelectedService(""); // Deselect the service if it was the selected one
        setSelectedSubServices([]); // Clear sub-services if deselecting the current service
      }
    }
  };

  const handleSubServiceChange = (subServiceName, subServicePrice) => {
    setSelectedSubServices((prevSelectedSubServices) => {
      const subService = `${subServiceName}:${subServicePrice}`;
      const isSelected = prevSelectedSubServices.includes(subService);

      let newSubServices;
      if (isSelected) {
        newSubServices = prevSelectedSubServices.filter(
          (s) => s !== subService
        );
      } else {
        newSubServices = [...prevSelectedSubServices, subService];
      }

      // Calculate new total price
      const newTotalPrice = newSubServices.reduce((total, subService) => {
        const price = parseFloat(subService.split(":")[1]);
        return total + price;
      }, 0);

      setUser((prevUser) => ({
        ...prevUser,
        selectedSubServices: newSubServices,
        totalPrice: newTotalPrice,
      }));

      return newSubServices;
    });
  };

  const currentService = services.find((s) => s.name === selectedService);

  return (
    <>
      <div
        id="appoinment"
        className="lg:w-full lg:h-auto lg:flex lg:flex-col lg:gap-[650px]"
      >
        <AdminNav/>

        <div
          className="absolute left-0 w-full h-[400px] bg-cover bg-center top-[120px]"
          style={{ backgroundImage: `url(${blog2})` }}
        >
          <div
            id="appoinmentBanner"
            className="w-full h-[400px] flex flex-col justify-center lg:w-full lg:h-[400px] lg:flex lg:justify-center lg:flex-col"
          >
              <h2 className="text-white text-[38px] font-semibold text-center lg:text-[64px] lg:font-semibold lg:text-center">
              Book a Makeup Session
            </h2>
            <p className="text-white text-[16px] font-semibold text-center lg:text-[20px] lg:font-semibold lg:text-center">
              Please fill out the appointment form below to make appointment
            </p>
          </div>
        </div>

        <form method="POST" className="lg:mt-[30px] mt-[480px]">
          <div
            id="conactform"
            className="lg:flex lg:justify-center lg:items-center lg:flex-col lg:h-[1200px] lg:mt-[-100px]"
          >
            <div
              id="div"
              className="lg:w-[1200px] lg:bg-[#f2f2f2] lg:mt-[-200px] lg:justify-center lg:items-center lg:flex lg:flex-col lg:rounded-[40px]"
            >
              {/* User Info */}
              <div
                id="rowOne"
                className="w-[600p] flex flex-col justify-center items-center gap-[20px] lg:w-[1200px] lg:p-[40px] lg:text-[20px] lg:flex lg:flex-row lg:justify-around lg:mt-[50px]"
              >
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInput}
                  placeholder="Enter your name"
                  className="w-[300px] h-[40px] p-[20px] rounded-[10px] border-2 lg:w-[400px] lg:h-[50px] lg:p-[4px] lg:rounded-[10px]"
                />

                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInput}
                  placeholder="Email Address"
                  className="w-[300px] h-[40px] p-[20px] rounded-[10px] border-2 lg:w-[400px] lg:h-[50px] lg:p-[4px] lg:rounded-[10px]"
                />
              </div>

              {/* Service Selection and subservice */}
              <div className="
              w-full grid grid-cols-2 p-[20px] gap-[10px]
              lg:w-[1000px] lg:flex lg:flex-row   lg:gap-[40px] lg:items-start lg:justify-start">
                <div
                  id="div"
                  className="
                   bg-red-300 p-[5px]
                  lg:w-[900px] lg:flex lg:flex-col lg:bg-white rounded-[10px] border-2 lg:p-[10px]  lg:items-start lg:justify-start mt-6"
                >
                  <h3 className="font-semibold text-lg mb-4">
                    Select Makeup Categories:
                  </h3>
                  {services.map((service) => (
                    <div key={service.name} className="mb-2">
                      <label>
                        <input
                          type="checkbox"
                          value={service.name}
                          checked={selectedService === service.name}
                          onChange={handleServiceChange}
                        />{" "}
                        {service.name}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Sub-Service Selection */}
                <div className="
                p-[5px]
                lg:w-[900px] lg:flex lg:flex-col bg-white rounded-[10px] border-2 lg:p-[10px] lg:items-start lg:justify-start mt-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Select Packages / Add-ons:
                  </h3>
                  {currentService && (
                    <div className="mb-4">
                      <h4 className="font-semibold">{currentService.name}:</h4>
                      {currentService.subServices.map((subService) => (
                        <div key={subService.name} className="ml-4">
                          <label>
                            <input
                              type="checkbox"
                              value={subService.name}
                              checked={selectedSubServices.includes(
                                `${subService.name}:${subService.price}`
                              )}
                              onChange={() =>
                                handleSubServiceChange(
                                  subService.name,
                                  subService.price
                                )
                              }
                            />{" "}
                            {subService.name} - ₹{subService.price}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p className="ml-[140px]">you selectes : <br />{user.selectedSubServices + "  "}</p>

              {/* Staff and Date Selection */}
              <div id="rowThree"  className="w-[600p] flex flex-col justify-center items-center gap-[20px] lg:w-[1200px] lg:p-[40px] lg:text-[20px] lg:flex lg:flex-row lg:justify-around lg:mt-[50px]">
                <div id="staff">
                <input
                  list="staffs"
                  name="staff"
                  placeholder="Select makeup artist"
                  value={user.staff}
                  onChange={handleInput}
                  className="
                  mt-[3 0px]
                  w-[300px] h-[40px] p-[20px] rounded-[10px] border-2 lg:w-[400px] lg:h-[50px] lg:p-[4px] lg:rounded-[10px]"
                />
                <datalist id="staffs">
                  <option value="Shivani" />
                  <option value="Anjali" />
                  <option value="Rahul" />
                </datalist>
                </div>
                
                
              

              <div className="mt-[20px]">
                <DatePicker
                  selected={user.date ? new Date(user.date) : null}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  filterDate={(date) => !isDateBooked(date)}
                  placeholderText="Select a date"
                  className="w-[300px] h-[40px] p-[20px] rounded-[10px] border-2 lg:w-[400px] lg:h-[50px] lg:p-[4px] lg:rounded-[10px]"
                />
              </div>
              </div>

              {/* Total Price Display */}
              <div className="mt-[20px] ml-[140px]">
                <h3>Total Price: ₹{user.totalPrice}</h3>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-[20px]">
                <button
                  onClick={PostData}
                  className="bg-[#f86f2d] text-white p-[10px] rounded-[10px] lg:p-[20px]"
                >
                  Book Session
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default BookAppoinment;