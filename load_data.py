from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_chroma import Chroma
from embedding_function import create_embedding_function
import os
import shutil
import argparse
DATA_PATH = "data"
CHROMA_PATH = "chroma"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Reset the database"
    )
    args = parser.parse_args()

    if args.reset:
        print("Clearing the database")
        clear_database()
    
    documents = load_documents()
    chunks = split_documents(documents)
    add_to_chroma(chunks)


def load_documents():
    document_loader = PyPDFDirectoryLoader(DATA_PATH)
    return document_loader.load()

def split_documents(documents: list[Document]):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False
    )
    return splitter.split_documents(documents)


def add_to_chroma(chunks: list[Document]):
    db=Chroma(
        persist_directory=CHROMA_PATH,
        collection_name="rag-chatbot",
        embedding_function=create_embedding_function()
    )
    chunks_with_ids = calculate_chunk_id(chunks)

    existing_items = db.get(include=[])
    existing_ids = set(existing_items["ids"])

    print(f"Number of existing documents in DB : {len(existing_ids)}")

    new_chunks = []
    for chunk in chunks_with_ids:
        if chunk.metadata["id"] not in existing_ids:
            new_chunks.append(chunk)
    if(len(new_chunks)):
        print(f"Adding new documents : {len(new_chunks)}")
        new_chunks_ids = [chunk.metadata["id"] for chunk in new_chunks]
        db.add_documents(new_chunks, ids=new_chunks_ids)
        # Note: Chroma automatically persists data when using persist_directory
        print(f"✅ Successfully added {len(new_chunks)} documents to the database")
    else:
        print("No new documents to add")
    

def calculate_chunk_id(chunks):
    
    last_page_id = None
    current_chunk_index = 0
    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"

        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index=0

        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id

        chunk.metadata["id"] = chunk_id
    return chunks

def clear_database():
    if(os.path.exists(CHROMA_PATH)):
        shutil.rmtree(CHROMA_PATH)
    

if __name__ == "__main__":
    main()