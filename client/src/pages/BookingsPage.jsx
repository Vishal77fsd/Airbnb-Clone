import { useEffect, useState } from "react";
import AccountNavigation from "../AccountNavigation.jsx";
import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios
      .get("/bookings")
      .then((response) => {
        setBookings(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <AccountNavigation />
      <div className="mt-8">
        {bookings?.length > 0 &&
          bookings.map((booking, index) => (
            <div key={index}>
              <Link
                to={`/account/bookings/${booking._id}`}
                className="flex gap-4  bg-gray-300 rounded-xl overflow-hidden mb-4"
              >
                <div className="w-48">
                  {booking.place.photos.length > 0 && (
                    <img
                      src={
                        "http://localhost:4000/uploads/" +
                        booking.place.photos[0]
                      }
                      alt="places_photos"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="py-3">
                  <h2 className="text-xl">{booking.place.title}</h2>
                  <div>
                    {format(new Date(booking.checkIn), "yyyy-mm-dd")}
                    &rarr;&nbsp;
                    {format(new Date(booking.checkOut), "yyyy-mm-dd")}
                  </div>
                  <div className="flex gap-4 justify-center mt-4">
                    <div>
                      Number Of Days :{" "}
                      {differenceInCalendarDays(
                        new Date(booking.checkOut),
                        new Date(booking.checkIn)
                      )}
                    </div>
                    <div className="border border-black"></div>
                    <div>
                      Total Price : ₹{" "}
                      {differenceInCalendarDays(
                        new Date(booking.checkOut),
                        new Date(booking.checkIn)
                      ) * booking.place.price}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BookingsPage;
