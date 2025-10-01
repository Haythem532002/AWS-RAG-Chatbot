from langchain_ollama import OllamaEmbeddings

def create_embedding_function():
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    return embeddings