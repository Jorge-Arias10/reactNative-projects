const CONFIG = {
  server_url: "https://dummyjson.com/products",
  num_items: 30,  
  use_server: false,
  loading_timeout_ms: 300,
  groq_api_key: process.env.EXPO_PUBLIC_GROQ_API_KEY || "PON_AQUI_TU_API_KEY"
}

export default CONFIG;