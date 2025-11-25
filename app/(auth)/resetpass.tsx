import ResetPasswordScreen from "@/components/authComponent/ResetPassword";
import { useAuth } from "@/context/AuthContext";
import { View } from "react-native";

const ResetPasswordPage = () => {
  const { session } = useAuth();
  const email = session?.user?.email || "";

  return (
    <View style={{ flex: 1 }}>
      <ResetPasswordScreen email={email}></ResetPasswordScreen>
    </View>
  );
};

export default ResetPasswordPage;
