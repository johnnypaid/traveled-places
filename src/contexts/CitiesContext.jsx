import { createContext, useEffect, useContext, useReducer } from "react";

const BASE_URL = "http://localhost:9000";

const CityContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    default:
      console.log(action);
      throw new Error("Unknown action");
  }
}
// eslint-disable-next-line react/prop-types
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function getCities() {
      dispatch({ type: "loading" });

      try {
        const result = await fetch(`${BASE_URL}/cities`);
        const cityList = await result.json();

        dispatch({ type: "cities/loaded", payload: cityList });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the data.",
        });
      }
    }

    getCities();
  }, []);

  async function getCity(id) {
    dispatch({ type: "loading" });

    try {
      const result = await fetch(`${BASE_URL}/cities/${id}`);
      const cityList = await result.json();

      dispatch({ type: "city/loaded", payload: cityList });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error loading city data.",
      });
    }
  }

  async function addCity(city) {
    try {
      const result = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(city),
        headers: { "Content-Type": "application/json" },
      });

      const data = await result.json();

      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error loading city data.",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city data.",
      });
    }
  }

  return (
    <CityContext.Provider
      value={{ cities, isLoading, currentCity, getCity, addCity, deleteCity }}
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
