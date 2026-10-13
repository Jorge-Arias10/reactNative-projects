import { StyleSheet, Text, View,Image } from 'react-native';
import { useState, useEffect } from 'react';
import { mockdata } from './constants/products.js'; 
import { useNavigation } from "@react-navigation/native";


import config from './config/config.js';


import Header from './Header';
import SearchPage from './SearchPage';


export default function HomeScreen() {
    const [loading, setLoading] = useState(true);
    const [theproducts, setTheproducts] = useState(mockdata.products);
    const navigation = useNavigation();
    
      useEffect(() => {

        let timer;
        let isMounted = true;

        async function load() {
            try {
                if (config?.use_server) {
                  // hacemos la peticion al servidor y sacamos datos si lo tenemos activado
                    const resp = await fetch(`${config.server_url}?limit=${config.num_items ?? 30}`);
                    const data = await resp.json();

                    if (!isMounted) return;
                    setTheproducts(data.products);
                } else {
                    // libreria
                    setTheproducts(mockdata.products);
                }
            } catch (error) {
                console.error("Error cargando productos:", error);
                setTheproducts(mockdata.products);
            } finally {
                const timeout = Math.max(Number(config?.loading_timeout_ms ?? 0), 0);
                timer = setTimeout(() => {
                    if (!isMounted) return;
                    setLoading(false);
                }, timeout);
            }
        }
        load();
        return () => {
            isMounted = false;
            if (timer) clearTimeout(timer);
        };
    }, []);

      if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <Image testID="loading" source={require('./cargando.gif')} style={styles.loadingImage} />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        );
      }
    
      return (
        <View style={styles.container} >
          <Header />
          <SearchPage navigation={navigation} theproducts={theproducts} />
        </View>
      );
    }
    


    


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7f8",
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff7f8",
  },
  loadingImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b6b6b",
  },
});

    
    

