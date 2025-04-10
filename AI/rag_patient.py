# # rag_patient.py
# import json
# import os
# from vector_index import retrieve_relevant_record  # Ensure this is defined in vector_index.py
# from langchain_google_genai import ChatGoogleGenerativeAI

# # Set your Google API key (ensure it's in your environment or hardcode for demo)
# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyDU8mIzLFSiCvGVXqfNwDa4v0FN6NvGBg4")

# def generate_answer_patient(query, relevant_record):
#     # Patient sees the full record
#     context = f"Your Medical Record:\n{json.dumps(relevant_record, indent=2)}"
#     messages = [
#         {"role": "system", "content": context},
#         {"role": "user", "content": f"Question: {query}\nAnswer:"}
#     ]
#     llm = ChatGoogleGenerativeAI(api_key=GOOGLE_API_KEY, model="gemini-1.5-flash")
#     response = llm.invoke(messages)
#     return response.text().strip()

# if __name__ == "__main__":
#     query = input("Enter your query (Patient Dashboard): ").strip()
#     record = retrieve_relevant_record(query)
#     answer = generate_answer_patient(query, record)
#     print("\nQuery:", query)
#     print("Answer:", answer)

# rag_patient.py
import json
import os
from vector_index import retrieve_relevant_record  # Make sure this function exists
from langchain_google_genai import ChatGoogleGenerativeAI

# Set your Google API key (ensure it's in your environment or replace with your key)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyDU8mIzLFSiCvGVXqfNwDa4v0FN6NvGBg4")

def chat_loop_patient():
    conversation_history = [
        {
            "role": "system",
            "content": "You are a helpful medical assistant that provides personalized answers based on your full medical record."
        }
    ]
    
    llm = ChatGoogleGenerativeAI(api_key=GOOGLE_API_KEY, model="gemini-1.5-flash")
    print("Patient Chat Session. Type 'exit' to end the conversation.\n")
    
    while True:
        user_input = input("Patient: ").strip()
        if user_input.lower() in ["exit", "quit"]:
            print("Exiting chat.")
            break
        
        # Retrieve the relevant patient record based on the query
        record = retrieve_relevant_record(user_input)
        if record:
            context = f"Your Medical Record:\n{json.dumps(record, indent=2)}"
        else:
            context = "No relevant record found."
        
        # Prepare messages: insert context as system message and add user input
        messages = conversation_history.copy()
        messages.insert(1, {"role": "system", "content": context})
        messages.append({"role": "user", "content": user_input})
        
        # Generate and print the response
        response = llm.invoke(messages)
        answer = response.text().strip()
        conversation_history.append({"role": "assistant", "content": answer})
        print("Assistant:", answer, "\n")

if __name__ == "__main__":
    chat_loop_patient()

