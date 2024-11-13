import useFetch from "../api/useFetch";
import { logInfo, logError } from "../../util/logging";

const useCreateDefaultCategories = () => {
  const { performFetch } = useFetch(
    "/habit-categories/auto-create-categories",
    async creationData => {
      if (creationData.success) {
        logInfo("Categories successfully auto-created.");
      } else {
        logError("Failed to auto-create categories:", creationData.message);
      }
    }
  );

  const createCategories = async () => {
    await performFetch({ method: "POST" });
  };

  return createCategories;
};

export default useCreateDefaultCategories;
