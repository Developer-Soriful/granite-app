import ResetPasswordScreen from "@/components/authComponent/ResetPassword";
import { View } from "react-native";

const ResetPasswordPage = () => {
  const email = "test@gmail.com";
  return (
    <View style={{ flex: 1 }}>
      <ResetPasswordScreen email={email}></ResetPasswordScreen>
    </View>
  );
};

export default ResetPasswordPage;
