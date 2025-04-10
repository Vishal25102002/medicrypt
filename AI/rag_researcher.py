import json
import os
from vector_index import retrieve_relevant_records  # Ensure this returns a list of records (each as a dict)
from langchain_google_genai import ChatGoogleGenerativeAI

# Set your Google API key (set this in your environment or replace the default string)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def sanitize_data(record, level="full"):
    """
    Fully anonymize a record for research purposes.
    """
    record = record.copy()
    if level == "full":
        record["patient_id"] = "[ANONYMIZED]"
        record["name"] = "[ANONYMIZED]"
    return record

def chat_loop_researcher():
    # Refined system prompt for a focused research assistant
    conversation_history = [
        {
            "role": "system",
            "content": (
                "You are a research assistant specializing in medical data analysis. "
                "Your task is to provide concise, focused insights and actionable trends based on aggregated, anonymized patient data. "
                "Avoid generic or off-topic responses. If asked about yourself or any non-research topic, reply with: "
                "'I am a research assistant designed solely to analyze anonymized patient data and provide research insights. Please provide a research-related query.' "
                "Concentrate on statistical trends, correlations, and significant research findings from the provided data."
            )
        }
    ]
    
    # Instantiate the ChatGoogleGenerativeAI model
    llm = ChatGoogleGenerativeAI(api_key=GOOGLE_API_KEY, model="gemini-1.5-flash")
    print("Researcher Chat Session. Type 'exit' to end the conversation.\n")
    
    while True:
        user_input = input("Researcher: ").strip()
        if user_input.lower() in ["exit", "quit"]:
            print("Exiting chat.")
            break
        
        # Check for off-topic query: if the user asks about the assistant itself.
        if "tell me about yourself" in user_input.lower():
            answer = (
                "Hi,I am a research assistant designed solely to analyze anonymized patient data and provide research insights. "
                "Please provide a research-related query."
            )
            print("Assistant:", answer, "\n")
            continue
        
        # Retrieve multiple relevant records for an aggregated view
        records = retrieve_relevant_records(user_input, top_k=3)
        if records:
            sanitized_records = [sanitize_data(rec, level="full") for rec in records]
            aggregated_context = "\n".join([json.dumps(rec, indent=2) for rec in sanitized_records])
            context = f"Aggregated Anonymized Data:\n{aggregated_context}"
        else:
            context = "No relevant records found."
        
        # Build the conversation messages with the refined system prompt and the context
        messages = conversation_history.copy()
        messages.insert(1, {"role": "system", "content": context})
        messages.append({"role": "user", "content": user_input})
        
        # Generate the response from the LLM
        response = llm.invoke(messages)
        answer = response.text().strip()
        conversation_history.append({"role": "assistant", "content": answer})
        print("Assistant:", answer, "\n")

if __name__ == "__main__":
    chat_loop_researcher()
