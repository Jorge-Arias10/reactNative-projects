import  { useMemo, useState } from "react";
import { View, Text, Image, StyleSheet, Button, ScrollView, ActivityIndicator, Alert } from "react-native";

process.env.EXPO_PUBLIC_GROQ_API_KEY

export default function ProductPage({ theproducts, navigation, route }) {
  const productsArray = Array.isArray(theproducts)? theproducts: theproducts?.products || [];

  const productId = Number(route?.params?.productId);
  const prod = useMemo(() => productsArray.find(({ id }) => id === productId),[productsArray, productId]);

  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleBack = () => {
    if (navigation?.canGoBack?.()) navigation.goBack();
    else navigation?.navigate?.("Home");
  };

  if (!prod) {
    return (
      <ScrollView contentContainerStyle={styles.center}>
        <Text testID="titulo" style={styles.title}>Producto no encontrado</Text>
        <Text>No existe un producto con esa id <Text style={styles.bold}>{String(productId)}</Text></Text>
        <View style={{ marginTop: 12 }}>
          <Button title="Volver" onPress={handleBack} />
        </View>
      </ScrollView>
    );
  }

  const title = prod.title ?? prod.name ?? `Producto ${prod.id}`;
  const reviews = Array.isArray(prod.reviews) ? prod.reviews : [];

  const ratings = reviews
    .map((r) => Number(r?.rating))
    .filter((n) => Number.isFinite(n));

  const avgFromReviews = ratings.length? ratings.reduce((a, b) => a + b, 0) / ratings.length: typeof prod.rating === "number"? prod.rating: 0;

  const avgRating = avgFromReviews.toFixed(2);
  const lastThree = reviews.slice(-3);

  async function handleSummaryClick() {
    try {
      setLoadingSummary(true);
      setSummary("");

      const lines = lastThree
        .map((c) => `- ${c?.comment || ""} (Rating: ${c?.rating ?? "-"})`)
        .join("\n");

      const prompt = `PROMPT: Crea un resumen de los siguientes comentarios de un producto. El producto es ${title}.${lines}`;

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {"Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Eres un asistente que resume reseñas de productos en 2-3 líneas claras." },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 150,
        }),
      });

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || "";
      setSummary(content || "No se recibió un resumen de la IA.");
    } catch (err) {
      console.error("Error Groq:", err);
      setSummary("Ocurrió un error al solicitar el resumen.");
      Alert.alert("Error", "No se pudo generar el resumen.");
    } finally {
      setLoadingSummary(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text testID="detalle" style={styles.title}>{title}</Text>

      <View style={styles.hero}>
        {prod.thumbnail ? (
          <Image source={{ uri: prod.thumbnail }} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Text>Sin imagen</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text><Text style={styles.bold}>ID:</Text> {prod.id}</Text>
          {"price" in prod && (
            <Text><Text style={styles.bold}>Precio:</Text> {prod.price}</Text>
          )}
          {prod.description ? (
            <Text style={styles.desc}>{prod.description}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.block} testID="comments">
      
        <View style={styles.row}>
          <Text testID="mediaresultado" style={styles.bold}>Calificación media: {avgRating}</Text>
        </View>

        <Text style={styles.subtitle}>Últimos 3 comentarios:</Text>

        {lastThree.length ? (
          lastThree.map((c, idx) => (
            <View key={idx} style={styles.comment}>
              <Text style={styles.commentAuthor}>{c?.reviewerName || "Anónimo"}</Text>
              {c?.comment ? <Text style={styles.commentText}>{c.comment}</Text> : null}
              <Text>Rating: {c?.rating ?? "-"}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.muted}>Este producto aún no tiene comentarios.</Text>
        )}
      </View>
      

      <View style={styles.block}>
        {loadingSummary ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button testID="summarybtn" title="Generar resumen" onPress={handleSummaryClick} color="#f8a8b6" />
        )}

        {!!summary && (
          <View style={styles.summaryBox}>
            <Text>{summary}</Text>
          </View>
        )}
      </View>

      <View style={styles.block}>
        <Button testID="volver" title="Volver" onPress={handleBack} color="#f8a8b6" />
      </View>
    </ScrollView>
  );
}




const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff7f8",
    padding: 16,
  },
  center: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff7f8",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#2f2f2f",
  },
  hero: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12, 
  },
  thumb: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#fde7ea",
    shadowColor: "#f2c8cf",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  bold: {
    fontWeight: "700",
    color: "#2b2b2b",
  },
  desc: {
    marginTop: 6,
    color: "#4b4b4b",
  },
  block: {
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avg: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    color: "#333",
  },
  comment: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fde7ea",
    shadowColor: "#f2c8cf",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  commentAuthor: {
    fontWeight: "600",
    marginBottom: 4,
  },
  commentText: {
    marginVertical: 4,
    color: "#444",
  },
  muted: {
    color: "#777",
  },
  summaryBox: {
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ffdfe3",
    borderRadius: 10,
    backgroundColor: "#fff1f3",
  },
  
  backButton: {
    marginTop: 12,
    alignSelf: "center",
    backgroundColor: "#ffdfe3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#7a2b33",
    fontWeight: "600",
  },
});
