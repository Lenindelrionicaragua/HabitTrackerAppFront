import { useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";

const EmailVerificationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = route.params;

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post("http://localhost:8081/auth/verify", {
          token
        });

        if (res.data.success) {
          navigation.replace("SuccessScreen");
        } else {
          navigation.replace("ErrorScreen", { msg: res.data.msg });
        }
      } catch (err) {
        navigation.replace("ErrorScreen", { msg: err.message });
      }
    };

    verifyToken();
  }, [token]);

  return null;
};

export default EmailVerificationScreen;
