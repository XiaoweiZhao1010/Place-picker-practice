import Places from "./Places.jsx";
import { useState, useEffect } from "react";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../utils/loc.js";
import { fetchAvailablePlaces, fetchUserPlaces } from "../utils/http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchUserPlaces() {
      try {
        const data = await fetchAvailablePlaces();
        // const userPlaces = await fetchUserPlaces();
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Got position:", position.coords);
            const sortedPlaces = sortPlacesByDistance(
              data,
              position.coords.latitude,
              position.coords.longitude
            );
            if (sortedPlaces.length !== 0) {
              setIsLoading(false);
            }
            setAvailablePlaces(sortedPlaces);
          },
          (error) => {
            console.error("Geolocation error:", error);
            // Fallback: maybe just show unsorted places
            setIsLoading(false);
            setAvailablePlaces(data);
          },
          {
            enableHighAccuracy: true, // try GPS/Wi-Fi first
            timeout: 10000, // fail after 10s
            maximumAge: 0, // don’t use cached location
          }
        );
      } catch (error) {
        setError({ message: error.message || "Something went wrong!" });
        setAvailablePlaces([]);
      }
    }
    fetchUserPlaces();
  }, []);
  if (error) {
    return (
      <Error
        title="An error occurred!"
        message={error.message}
        onConfirm={() => setError(null)}
      />
    );
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isLoading}
      loadingText="Loading places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
