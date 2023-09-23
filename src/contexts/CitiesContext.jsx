import { createContext, useState, useEffect, useContext } from "react";

const BASE_URL = "http://localhost:9000";

const CityContext = createContext();

// eslint-disable-next-line react/prop-types
function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function getCities() {
      try {
        setIsLoading(true);

        const result = await fetch(`${BASE_URL}/cities`);
        const cityList = await result.json();

        // console.log(cityList);

        setCities(cityList);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    getCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);

      const result = await fetch(`${BASE_URL}/cities/${id}`);
      const cityList = await result.json();

      console.log(cityList);

      setCurrentCity(cityList);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addCity(city) {
    console.log(city);
    try {
      setIsLoading(true);

      const result = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(city),
        headers: { "Content-Type": "application/json" },
      });

      const data = await result.json();

      setCities((cities) => [...cities, data]);

      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CityContext.Provider
      value={{ cities, isLoading, currentCity, getCity, addCity }}
    >
      {children}
    </CityContext.Provider>
  );
}

// custom hook
function useCities() {
  const context = useContext(CityContext);

  if (context === undefined)
    throw new Error("Cities context was used outside provider.");

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
