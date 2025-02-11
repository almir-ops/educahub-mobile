import { AuthProvider } from "./context/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toolbar from "./components/Toolbar";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            header: () => <Toolbar />, // Adiciona a sua própria toolbar
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            header: () => <Toolbar />, // Adiciona a sua própria toolbar
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false, // Oculta a barra de navegação padrão
          }}
        />
      </Stack.Navigator>
    </AuthProvider>
  );
}
