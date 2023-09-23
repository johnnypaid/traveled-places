// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useState, useEffect } from "react";
import { useUrlPosition } from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";

const BASE_URL = "https://api.bigdatacloud.net";

function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);
  const [geolocationError, setGeolocationError] = useState("");
  const { lat, lng } = useUrlPosition();
  const [startDate, setStartDate] = useState(new Date());
  const { addCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lat && !lng) return;

    async function getCity() {
      try {
        setIsLoadingGeolocation(true);
        setGeolocationError("");

        const getCity = await fetch(
          `${BASE_URL}/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const cityData = await getCity.json();

        if (!cityData.city) throw new Error("That doesn't seem to be a city.");

        setCityName(cityData.city || cityData.locality || "");
        setCountry(cityData.countryName || cityData.locality || "");
        setEmoji(convertToEmoji(cityData.countryCode));

        console.log(cityData);
      } catch (error) {
        setGeolocationError(error.message);
      } finally {
        setIsLoadingGeolocation(false);
      }
    }

    getCity();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !startDate) return;

    const newCity = {
      cityName,
      country,
      emoji,
      notes: "Amazing 😃",
      date: startDate,
      position: { lat, lng },
    };
    await addCity(newCity);
    navigate("/app/cities");
  }

  if (isLoadingGeolocation) return <Spinner />;

  if (!lat && !lng)
    return <Message message={"Start by clicking somewhere in the map"} />;

  if (geolocationError) return <Message message={geolocationError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="startDate">When did you go to {cityName}?</label>
        <DatePicker
          id="startDate"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
