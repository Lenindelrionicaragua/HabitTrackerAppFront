import useFetch from "./useFetch";
import { logInfo, logError } from "../../util/logging";

const useSaveDailyRecords = () => {
  // Aquí no pasamos directamente el store, sino que dejamos que cada función gestione su propio estado.
  const { error, performFetch } = useFetch(); // Asumimos que `url` y `minutesUpdate` serán proporcionados por el caller.

  const createDailyRecord = async (url, minutesUpdate) => {
    try {
      // Pasamos directamente los parámetros aquí.
      const isSuccessful = await performFetch({
        method: "POST",
        data: { minutesUpdate }, // Pasamos el valor de minutesUpdate
        url: url // Asegúrate de que la URL esté bien formateada y válida
      });

      // Si la operación fue exitosa, devolvemos el resultado.
      if (isSuccessful) {
        logInfo("DailyRecord successfully saved.");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      const errMsg = "Failed to save the record.";
      logError(errMsg, error); // Logueamos el error, incluyendo la excepción.
      return false;
    }
  };

  return { error, createDailyRecord };
};

export default useSaveDailyRecords;
