import json
import os
from sentence_transformers import SentenceTransformer
from langchain_community.vectorstores import Chroma

# ---------- Wrapper for Embeddings ----------
class SentenceTransformerEmbeddings:
    def __init__(self, model):
        self.model = model

    def embed_documents(self, texts):
        # Returns embeddings for a list of texts
        return self.model.encode(texts)

    def embed_query(self, text: str):
        # Returns an embedding for a single query
        return self.model.encode([text])[0]

# ---------- Configuration ----------
DATA_FILE = 'patient_records.json'  # Ensure this file exists with your data

# ---------- Load Patient Records ----------
def load_patient_records():
    with open(DATA_FILE, 'r') as f:
        records = json.load(f)
    return records

patient_records = load_patient_records()

# ---------- Generate Embeddings ----------
# Initialize the SentenceTransformer model
model = SentenceTransformer('all-MiniLM-L6-v2')
embedding_function = SentenceTransformerEmbeddings(model)

# ---------- Set Up ChromaDB (Using the new API) ----------
collection = Chroma(
    persist_directory="./vector_store",
    collection_name="patient_records",
    embedding_function=embedding_function
)

# Index each patient record into the collection
for i, record in enumerate(patient_records):
    collection.add_texts(
        texts=[json.dumps(record)],
        ids=[f"record_{i}"]
    )

# ---------- Retrieval Functions ----------
def retrieve_relevant_record(query, top_k=1):
    results = collection.similarity_search(query, k=top_k)
    if results and len(results) > 0:
        record = json.loads(results[0].page_content)
        return record
    return None

def retrieve_relevant_records(query, top_k=3):
    results = collection.similarity_search(query, k=top_k)
    records = []
    for res in results:
        records.append(json.loads(res.page_content))
    return records

if __name__ == "__main__":
    test_query = "blood test"
    rec = retrieve_relevant_record(test_query)
    print("Most Relevant Record:", rec)
