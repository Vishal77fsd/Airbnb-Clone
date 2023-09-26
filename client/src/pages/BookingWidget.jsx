import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { useEffect } from "react";

const BookingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [noOfGuests, setNoOfGuests] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  let noOfDays = 0;

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  if (checkIn && checkOut) {
    noOfDays = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisPlace() {
    // console.log(place);
    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      phone,
      place: place._id,
      name,
      price: noOfDays * place.price,
    });

    const bookingId = response.data._id;
    console.log(bookingId);
    setRedirect(`/account/booking/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      <div className="bg-gray-100 shadow-sm shadow-blue-400 p-4 rounded-2xl">
        <div className="text-xl text-center">
          ₹ Price : {place.price} / per night
        </div>
        <div className="border rounded-lg">
          <div className="flex">
            <div className=" my-4 bg-gray-100 py-2 px-4 ">
              <label>Check in : </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className=" my-4 bg-gray-100 py-2 px-4 border-l">
              <label>Check out : </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className=" my-4 bg-gray-100 py-2 px-4 border-t">
            <label>No Of Guests : </label>
            <input
              type="number"
              value={noOfGuests}
              onChange={(e) => setNoOfGuests(e.target.value)}
            />
          </div>
          {noOfDays > 0 && (
            <div className=" my-4 bg-gray-100 py-2 px-4 border-t">
              <label>Name : </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label>Phone No : </label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}
        </div>
        <button onClick={bookThisPlace} className="primary mt-4">
          Rent this place
          {noOfDays > 0 && <span> ₹{noOfDays * place.price}</span>}
        </button>
      </div>
    </div>
  );
};

export default BookingWidget;
