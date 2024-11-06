import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useFetch from "../../hooks/api/useFetch";
import { setHabitCategories } from "../../actions/counterActions";
import { logInfo } from "../../util/logging";

const useHabitCategories = () => {
  const dispatch = useDispatch();

  const { data, error, isLoading, performFetch, cancelFetch } = useFetch(
    "/habit-categories",
    receivedData => {
      if (receivedData.success) {
        // Extraer solo los nombres de las categorías
        const categoryNames = receivedData.categories.map(
          category => category.name
        );

        // Despachar solo los nombres al estado
        dispatch(setHabitCategories(categoryNames));

        // Log para verificar que se están recibiendo solo los nombres
        logInfo(categoryNames);
      }
    }
  );

  const fetchHabitCategories = useCallback(() => {
    performFetch();
  }, [performFetch]);

  return {
    habitCategories: data?.categories || [],
    message: data?.msg || "",
    error,
    isLoading,
    fetchHabitCategories
  };
};

export default useHabitCategories;
