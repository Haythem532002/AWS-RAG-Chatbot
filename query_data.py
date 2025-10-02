from embedding_function import create_embedding_function
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
import argparse


CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:
{context}
-------

Answer the question based on the above context: {question}
"""

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, help="The query text .")
    args = parser.parse_args()
    query_text = args.query_text
    query_rag(query_text)

def query_rag(query_text: str):
    embedding_function = create_embedding_function()
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embedding_function,
        collection_name="rag-chatbot"
    )

    results = db.similarity_search_with_score(
        query_text,
        k=3
    )

    if not results:
        return {
            "response": "I couldn't find any relevant information to answer your question.",
            "sources": [],
            "context": [],
            "num_sources": 0
        }

    # Prepare context and sources
    context_docs = []
    sources = []
    
    for doc, score in results:
        context_docs.append({
            "content": doc.page_content,
            "source": doc.metadata.get("id", "Unknown"),
            "score": float(score),
            "page": doc.metadata.get("page", "Unknown"),
            "file": doc.metadata.get("source", "Unknown")
        })
        sources.append(doc.metadata.get("id", "Unknown"))

    context_text = "\n\n----\n\n".join([doc.page_content for doc, _score in results])
    
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE) 

    prompt = prompt_template.invoke({ 
        "context": context_text,
        "question": query_text
    })

    model = OllamaLLM(model="mistral")
    response_text = model.invoke(prompt)

    # Prepare detailed result
    result = {
        "response": response_text,
        "sources": sources,
        "context": context_docs,
        "num_sources": len(results),
        "query": query_text
    }
    
    # For command line usage, print the formatted response
    if __name__ == "__main__":
        formatted_response = f"Response : {response_text}\nSources : {sources}"
        print(formatted_response)
        return response_text  # Return just text for CLI
    
    # For Flask backend, return detailed information
    return result


if __name__ == "__main__": 
    main()
