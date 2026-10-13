import React, { useEffect, useMemo, useState } from "react";
import {View, Text, Image, StyleSheet, TextInput,  Button, TouchableOpacity, FlatList, ScrollView} from "react-native";

let Picker;
let isNativePicker = true;
try {
  Picker = require('@react-native-picker/picker').Picker;
} catch (err) {
  isNativePicker = false;
}


export default function SearchPage({ theproducts, navigation, route }) {

  const productsArray = Array.isArray(theproducts)? theproducts: theproducts?.products || [];

  const categoryFromParams = route?.params?.category || "All";

  const [categoria, setCategoria] = useState(categoryFromParams);
  const [filtro, setFiltro] = useState("");
  const [filtroAplicado, setFiltroAplicado] = useState("");

  const categorias = useMemo(() => {
    const uniques = productsArray.reduce((acc, p) => {
      const cat = p?.category;
      if (cat && !acc.includes(cat)) acc.push(cat);
      return acc;
    }, []);
    return ["All", ...uniques];
  }, [productsArray]);

  useEffect(() => {
    setCategoria(categoryFromParams);
  }, [categoryFromParams]);

  const productosFiltrados = useMemo(() => {
    const texto = (filtroAplicado || "").toLowerCase();
    return productsArray.filter((p) => {
      const titleOk = (p?.title || "").toLowerCase().includes(texto);
      const catOk = categoria === "All" || p?.category === categoria;
      return (filtroAplicado ? titleOk : true) && catOk;
    });
  }, [productsArray, filtroAplicado, categoria]);

  function aplicarFiltro() {
    setFiltroAplicado(filtro.trim());
  }

  function handleCategoryChange(newCategory) {
    setCategoria(newCategory);
    
  }

  function goToProduct(item) {
    navigation.navigate("Product", { productId: item.id });
  }

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper} testID={`item_${item.id}`}>
        <View style={styles.card}>
        {item.thumbnail ? (
            <TouchableOpacity onPress={() => goToProduct(item)} accessibilityLabel={`Ver producto ${item.title}`}>
            <Image source={{ uri: item.thumbnail }} style={styles.cardImage} resizeMode="cover" />
            </TouchableOpacity>
        ) : (
            <View style={[styles.cardImage, styles.imagePlaceholder]}>
            <Text>Sin imagen</Text>
            </View>
        )}

        <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={2} testID={`title_${item.id}`}>
            {item.title}
            </Text>

            {item.brand ? (
            <Text style={styles.cardSubtitle} numberOfLines={1}>
                {item.brand}
            </Text>
            ) : null}

            <Button title="Ver producto" onPress={() => goToProduct(item)} testID={`button_${item.id}`} color="#f8a8b6" />
        </View>
        </View>
    </View>
    );


  return (
    <View style={styles.container}>
      <Text testID="catalogo" style={styles.header}>
        Catálogo
      </Text>

      <View style={styles.controls}>
        <TextInput
          testID="filtro"
          placeholder="Buscar producto"
          value={filtro}
          onChangeText={setFiltro}
          style={styles.input}
        />
        <Button testID="buscador" title="Filtrar" onPress={aplicarFiltro} color="#f8a8b6" />
      </View>

      <View style={styles.pickerBox}>
        {isNativePicker ? (
          <Picker
            selectedValue={categoria}
            onValueChange={handleCategoryChange}
            mode="dropdown"
            style={styles.picker}
          >
            {categorias.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        ) : (
          <ScrollView horizontal contentContainerStyle={styles.pillsContainer} showsHorizontalScrollIndicator={false}>
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat}
                testID={`cat_${cat}`}
                style={[styles.pill, categoria === cat && styles.pillActive]}
                onPress={() => handleCategoryChange(cat)}
              >
                <Text style={[styles.pillText, categoria === cat && styles.pillTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View  style={styles.resultsContainer}>
        <FlatList
          
          data={productosFiltrados}
          keyExtractor={(item, idx) =>
            String(item.id ?? item.title ?? `k-${idx}`)
          }
          renderItem={renderItem}
          numColumns={3} 
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: "#fff7f8", // fondo rosa claro
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "#2b2b2b",
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f5cfd4",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "#fff",
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#f5cfd4",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 44,
  },
  pillsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f5cfd4',
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: '#f8a8b6',
    borderColor: '#f8a8b6',
  },
  pillText: {
    color: '#333',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#fff',
  },
  resultsContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#fde7ea",
    shadowColor: "#f2c8cf",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#fdf2f3",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2b2b2b",
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#666",
  },
});
