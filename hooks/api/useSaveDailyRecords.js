import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useFetch from "./useFetch";
import { logInfo, logError } from "../../util/logging";

const useSaveDailyRecords = () => {
  const habitCategoryIndex = useSelector(
    state => state.habitCategoryIndex.habitCategoryIndex
  );
  const habitCategories = useSelector(
    state => state.habitCategories.habitCategories
  );
  const categoryId =
    habitCategoryIndex !== null
      ? habitCategories?.[habitCategoryIndex]?.id
      : null;
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);

  const minutesUpdate = Math.round((elapsedTime / 60) * 100) / 100;

  // Mantén el estado del URL
  const [url, setUrl] = useState("/time-records"); // Establece un valor por defecto

  useEffect(() => {
    // Actualiza el URL solo cuando categoryId no sea null
    if (categoryId !== null) {
      const newUrl = `/time-records/${categoryId}`;
      setUrl(newUrl);
      logInfo(`URL updated: ${newUrl}`); // Log cuando el URL se reconstruya
    }
  }, [categoryId]); // Este efecto se dispara cada vez que categoryId cambia

  const { error, performFetch } = useFetch(url, async creationData => {
    if (creationData?.success) {
      logInfo("DailyRecord successfully saved.");
      return true;
    }
    return false;
  });

  logInfo(`UseSaveDaily Url: ${url}`); // Este log inicial se ejecuta siempre que se renderiza el componente

  useEffect(() => {
    if (error) {
      logError(error);
    }
  }, [error]);

  const createDailyRecord = async () => {
    try {
      const isSuccessful = await performFetch({
        method: "POST",
        data: { minutesUpdate: minutesUpdate }
      });

      if (!isSuccessful) {
        throw new Error("Failed to save the record.");
      }
      return isSuccessful;
    } catch (error) {
      const errMsg = "Failed to save the record.";
      logError(errMsg);
      return { success: false, error };
    }
  };

  return { createDailyRecord };
};

export default useSaveDailyRecords;
