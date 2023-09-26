import { useEffect, useState } from "react";
import Perks from "./Perks";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNavigation from "../AccountNavigation";
import { Navigate, useParams } from "react-router-dom";

const PlacesFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/places/" + id)
      .then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // Function to Submit Form
  async function savePlace(e) {
    e.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    if (id) {
      // Update
      await axios.put("/places", { id, ...placeData });
      setRedirect(true);
    } else {
      // New Place
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  // UseFull Function
  function inputHeader(text) {
    return <h2 className="text-2xl mt-6">{text}</h2>;
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <>
      <AccountNavigation />
      <div>
        <form onSubmit={savePlace}>
          {inputHeader("Title")}
          <input
            type="text"
            value={title}
            placeholder="Title, for example: My Appartment"
            onChange={(e) => setTitle(e.target.value)}
          />
          {inputHeader("Address")}
          <input
            type="text"
            value={address}
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
          />
          {inputHeader("Photos")}

          {/* Photos Uploader*/}
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

          {/* Description */}
          <div>
            {inputHeader("Description")}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Perks */}
          {inputHeader("Perks")}
          <div>
            <div className="flex gap-2 flex-wrap mt-4">
              <Perks selected={perks} onChange={setPerks} />
            </div>
          </div>

          {/* Extra Info */}
          <div>
            {inputHeader("Extra Info")}
            <textarea
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
            ></textarea>
          </div>

          <div>
            {inputHeader("Check In & Out, Max Guests")}
            <div className="grid sm:grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <h3 className="mt-2 -mb-1">Check In Time</h3>
                <input
                  type="text"
                  placeholder="10"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Check Out Time</h3>
                <input
                  type="text"
                  placeholder="20"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Max Number Of Guests</h3>
                <input
                  type="number"
                  placeholder="4"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Price per night</h3>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button className="primary my-4">Save</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PlacesFormPage;
