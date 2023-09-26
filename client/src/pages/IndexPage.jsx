import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios
      .get("/places")
      .then((response) => setPlaces(response.data))
      .catch((err) => {
        throw err;
      });
  }, []);

  return (
    <div className="mt-8  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {places.length > 0 &&
        places.map((place) => (
          <Link to={"/place/" + place._id} key={place.id}>
            <div className="bg-gray-500 mb-2 rounded-xl flex">
              {place.photos.length > 0 && (
                <img
                  src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                  alt="img"
                  className="rounded-xl object-cover aspect-square"
                />
              )}
            </div>
            <h2 className="font-semibold">{place.address}</h2>
            <h3 className="text-sm text-gray-400">{place.title}</h3>
            <div className="mt-4">
              <span className="font-semibold">₹{place.price}</span> per night
            </div>
          </Link>
        ))}
    </div>
  );
}
