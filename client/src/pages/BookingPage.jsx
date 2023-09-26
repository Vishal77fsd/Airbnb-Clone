import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const BookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get("/bookings")
        .then((response) => {
          const foundBooking = response.data.find(({ _id }) => _id === id);

          if (foundBooking) {
            console.log(foundBooking);
            setBooking(foundBooking);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  if (!booking) {
    return "";
  }
  return (
    <div className="my-8">
      <h1 className="text-2xl ">{booking.place.title}</h1>
      <Link
        to={"https://maps.google.com/?q=" + booking.place.address}
        target="_blank"
        className="underline flex font-semibold my-2 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        {booking.place.address}
      </Link>

      <div className="bg-gray-300 p-4 mb-4 rounded-md">
        <h2 className="font-bold">Booking Information</h2>
        <div className="py-3">
          <div>
            Check In : {format(new Date(booking.checkIn), "yyyy-mm-dd")}
            &rarr;&nbsp; Check Out :{" "}
            {format(new Date(booking.checkOut), "yyyy-mm-dd")}
          </div>
          <div className="mt-4">
            <div>
              Number Of Days :{" "}
              {differenceInCalendarDays(
                new Date(booking.checkOut),
                new Date(booking.checkIn)
              )}
            </div>
            <div></div>
            <div>
              Total Price : ₹{" "}
              {differenceInCalendarDays(
                new Date(booking.checkOut),
                new Date(booking.checkIn)
              ) * booking.place.price}
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] border rounded-lg overflow-hidden">
          <div className="">
            {booking.place?.photos[0] && (
              <div>
                <img
                  src={
                    "http://localhost:4000/uploads/" + booking.place.photos[0]
                  }
                  alt="img"
                  className="aspect-square object-cover"
                />
              </div>
            )}
          </div>
          <div className="grid">
            <div>
              {booking.place?.photos[1] && (
                <img
                  src={
                    "http://localhost:4000/uploads/" + booking.place.photos[1]
                  }
                  alt="img"
                  className="aspect-auto object-cover"
                />
              )}
            </div>
            <div className="overflow-hidden">
              {booking.place?.photos[2] && (
                <img
                  src={
                    "http://localhost:4000/uploads/" + booking.place.photos[2]
                  }
                  alt="img"
                  className="aspect-auto object-cover relative top-2"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
