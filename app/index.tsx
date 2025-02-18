import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext"; // Certifique-se de importar
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toolbar from "./components/Toolbar";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              header: () => <Toolbar />,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              header: () => <Toolbar />,
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </AuthProvider>
    </LoadingProvider>
  );
}
