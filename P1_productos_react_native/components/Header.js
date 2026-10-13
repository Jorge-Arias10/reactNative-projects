import { View, Text, Image, StyleSheet } from 'react-native';
import user_info from '../user.json';

export default function Header(){
  return(
    <View testID="cabecera" style={styles.container}>
      <Image testID="logo" source={require('./LogoJorge.png')} style={styles.logo} />
      <Text testID="mensaje">Bienvenido a la aplicación de {user_info?.name}</Text>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fdeef2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 12,
    marginHorizontal: 12,
    shadowColor: "#e6bfc6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
    resizeMode: "cover",
  },
  mensaje: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b3b3b",
    textAlign: "center",
  },
});

