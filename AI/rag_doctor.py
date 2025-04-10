import json
import os
from vector_index import retrieve_relevant_record  # Must return a dict for the given query
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts.chat import ChatPromptTemplate

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def sanitize_data(record, level="partial"):
    record = record.copy()
    if level == "partial":
        record["name"] = "[PATIENT_NAME]"
    return record

def chat_loop_doctor():
    # Enhanced system prompt for a clinical assistant
    conversation_history = [
        {
            "role": "system",
            "content": (
                "You are a clinical assistant supporting doctors in reviewing patient records. "
                "Your role is to provide detailed, actionable clinical insights, recommendations, and if needed, ask clarifying questions. "
                "Focus on abnormal lab values, potential diagnoses, medication suggestions, and follow-up testing. "
                "Keep your analysis clear, precise, and evidence-based."
            )
        }
    ]
    
    
    # Improved prompt template for clinical analysis
    prompt_template = ChatPromptTemplate.from_messages([
        "You are a clinical assistant supporting doctors in reviewing patient records.",
        "Reply properly to greeting messages like how are you?",
        "don't give unnecessary reply until user asks a specific query regarding the patients record.",
        ("system", "Patient Record for Review:\n{context}"),
        ("user", "Doctor Query: {input}\nPlease provide a detailed clinical analysis and recommendations:")
    ])
    
    llm = ChatGoogleGenerativeAI(api_key=GOOGLE_API_KEY, model="gemini-1.5-flash")
    print("Doctor Chat Session. Type 'exit' to end the conversation.\n")
    
    while True:
        user_input = input("Doctor: ").strip()
        if user_input.lower() in ["exit", "quit"]:
            print("Exiting chat.")
            break

        # Handle basic greetings
        if user_input.lower() in ["hey", "hi", "hello"]:
            print("Assistant: Hello, how can I assist you today?\n")
            continue
        
        record = retrieve_relevant_record(user_input)
        if record:
            sanitized_record = sanitize_data(record, level="partial")
            context = json.dumps(sanitized_record, indent=2)
        else:
            context = "No relevant patient record found."
        
        formatted_prompt = prompt_template.format(input=user_input, context=context)
        response = llm.invoke([{"role": "user", "content": formatted_prompt}])
        answer = response.text().strip()
        print("Assistant:", answer, "\n")

if __name__ == "__main__":
    chat_loop_doctor()
