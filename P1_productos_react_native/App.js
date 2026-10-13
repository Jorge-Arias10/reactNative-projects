import { mockdata } from './components/constants/products.js'; 
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProductPage from './components/ProductPage.js';
import HomeScreen from './components/HomeScreen.js';


export default function App() {
  const mockProducts = mockdata.products;
  const Stack = createNativeStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />

        <Stack.Screen name="Product" options={{ title: "Detalle del producto" }}>
          {props => <ProductPage {...props} theproducts={mockProducts} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

}