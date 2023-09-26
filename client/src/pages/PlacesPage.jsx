import { Link } from "react-router-dom";
import AccountNavigation from "../AccountNavigation";
import { useEffect, useState } from "react";
import axios from "axios";

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios
      .get("/user-places")
      .then(({ data }) => {
        setPlaces(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <AccountNavigation />
      <div className="mt-8">
        <div className="text-center">
          list of all added places
          <br />
          <Link
            className="inline-flex gap-2 bg-primary text-black py-2 px-6 rounded-md "
            to={"/account/places/new"}
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
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add New Places
          </Link>
        </div>
        <div className="mt-4">
          {places.length > 0 &&
            places.map((place, index) => (
              <div
                key={index}
                className="flex cursor-pointer gap-4 border bg-gray-200 p-4 rounded-md"
              >
                {/* Images */}
                <Link
                  to={"/account/places/" + place._id}
                  className="flex w-32 h-32 shrink-0 bg-gray-100"
                >
                  {/* <PlaceImg place={place} /> */}
                  {place.photos.length > 0 && (
                    <img
                      src={"http://localhost:4000/uploads/" + place.photos[0]}
                      alt="places_photos"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="grow-0 shrink">
                  <h2 className="text-lg">{place.title}</h2>
                  <p className="text-sm mt-2">{place.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesPage;
