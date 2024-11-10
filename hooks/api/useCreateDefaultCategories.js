import useFetch from "../api/useFetch";
import { logInfo, logError } from "../../util/logging";

const useCreateDefaultCategories = () => {
  const { performFetch } = useFetch(
    "/habit-categories/auto-create-categories",
    async creationData => {
      if (creationData.success) {
        logInfo("Categories successfully auto-created.");
      } else {
        logError("Failed to auto-create categories:", creationData);
      }
    }
  );

  const createCategories = async () => {
    try {
      await performFetch({
        method: "POST"
      });
    } catch (error) {
      logError("Error in creating categories:", error);
    }
  };

  return createCategories;
};

export default useCreateDefaultCategories;
