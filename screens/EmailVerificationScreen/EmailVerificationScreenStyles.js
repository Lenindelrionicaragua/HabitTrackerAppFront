// EmailVerificationScreen.js
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";

const EmailVerificationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = route.params;
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post("http://localhost:8081/auth/verify", {
          token
        });

        if (res.data.success) {
          setStatus("success");
          navigation.replace("SuccessScreen");
        } else {
          setStatus("fail");
          navigation.replace("ErrorScreen", { msg: res.data.msg });
        }
      } catch (err) {
        setStatus("fail");
        navigation.replace("ErrorScreen", { msg: err.message });
      }
    };

    verifyToken();
  }, [token]);

  return null; // o puedes mostrar un spinner mientras se verifica
};

export default EmailVerificationScreen;
