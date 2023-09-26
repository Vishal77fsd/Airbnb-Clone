import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidget from "./BookingWidget";

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Get request to get the place of id
    axios
      .get("/places/" + id)
      .then((response) => {
        setPlace(response.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!place) {
    return "";
  }

  if (showAllPhotos) {
    return (
      <div className="inset-0 absolute">
        <div className="p-8 grid gap-4 bg-black ">
          <div>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed flex gap-2 p-2 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                  clipRule="evenodd"
                />
              </svg>
              Close Gallery
            </button>
          </div>
          {place?.photos?.length > 0 &&
            place.photos.map((photo, index) => (
              <div key={index}>
                <img src={"http://localhost:4000/uploads/" + photo} alt="img" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 py-8">
      <h1 className="text-3xl">{place.title}</h1>
      <Link
        to={"https://maps.google.com/?q=" + place.address}
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
        {place.address}
      </Link>
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] border rounded-lg overflow-hidden">
          <div className="">
            {place.photos[0] && (
              <div>
                <img
                  onClick={() => setShowAllPhotos(true)}
                  src={"http://localhost:4000/uploads/" + place.photos[0]}
                  alt="img"
                  className="aspect-square object-cover"
                />
              </div>
            )}
          </div>
          <div className="grid">
            <div>
              {place.photos[1] && (
                <img
                  onClick={() => setShowAllPhotos(true)}
                  src={"http://localhost:4000/uploads/" + place.photos[1]}
                  alt="img"
                  className="aspect-auto object-cover"
                />
              )}
            </div>
            <div className="overflow-hidden">
              {place.photos[2] && (
                <img
                  onClick={() => setShowAllPhotos(true)}
                  src={"http://localhost:4000/uploads/" + place.photos[2]}
                  alt="img"
                  className="aspect-auto object-cover relative top-2"
                />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="absolute bottom-2 right-2 py-1 px-2 text-black bg-white rounded-lg  shadow-sm shadow-gray-400 flex justify-center gap-1 items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clipRule="evenodd"
            />
          </svg>
          Show More Photos
        </button>
      </div>

      {/* Check In and Check Out */}
      <div className="mt-8 mb-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          {/* Description */}
          <div className="my-4 ">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          Check-in : {place.checkIn}
          <br />
          Check-out : {place.checkOut}
          <br />
          Max No of Guests : {place.maxGusests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra Information</h2>
        </div>
        <div className="text-sm text-gray-600 leading-6 mb-4 mt-2">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
