import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../utils/loc.js";
import { fetchAvailablePlaces } from "../utils/http.js";
import useFetch from "../hooks/useFetch.js";

async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces();
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const sortedPlaces = sortPlacesByDistance(
          places,
          position.coords.latitude,
          position.coords.longitude
        );
        resolve(sortedPlaces);
      },
      (error) => {
        console.error(error);
        resolve(places);
      }
    );
  });
}
export default function AvailablePlaces({ onSelectPlace }) {
  const {
    isLoading,
    error,
    fetchedData: availablePlaces,
  } = useFetch(fetchSortedPlaces, []);
  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
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
