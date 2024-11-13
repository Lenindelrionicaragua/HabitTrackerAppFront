import useFetch from "../api/useFetch";
import { useState, useEffect } from "react";
import { logInfo, logError } from "../../util/logging";

const useCreateDefaultCategories = () => {
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");
  const { performFetch, error, isLoading } = useFetch(
    "/habit-categories/auto-create-categories",
    async creationData => {
      if (creationData.success) {
        setSuccess(true);
        setMessage("Categories successfully auto-created.");
        logInfo("Categories successfully auto-created.");
      }
    }
  );

  useEffect(() => {
    if (error) {
      setSuccess(false);
      setMessage(`Error: ${error.message || "An unknown error occurred"}`);
      logError(`Error: ${error.message}`);
    }
  }, [error]);

  const createCategories = async () => {
    setSuccess(null);
    setMessage("");
    await performFetch({ method: "POST" });
  };

  return { success, message, createCategories, isLoading };
};

export default useCreateDefaultCategories;
