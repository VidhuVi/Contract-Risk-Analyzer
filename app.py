from flask import Flask, request, jsonify
import spacy
import docx
import PyPDF2 # Might need to adjust for newer versions or use pdfplumber
import io

app = Flask(__name__)

# Load SpaCy model (only once when the app starts)
try:
    nlp = spacy.load("en_core_web_sm")
    print("SpaCy model 'en_core_web_sm' loaded successfully.")
except Exception as e:
    print(f"Error loading SpaCy model: {e}")
    print("Please ensure you've run 'python -m spacy download en_core_web_sm'")
    nlp = None # Handle case where model fails to load

@app.route('/')
def hello_world():
    return 'Hello, Contract Analyzer!'

@app.route('/analyze', methods=['POST'])
def analyze_text():
    # This will be our main analysis endpoint
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    if nlp:
        doc = nlp(text)
        # For now, just return a simple confirmation
        return jsonify({"message": "Text received and processed (placeholder)", "length": len(doc)})
    else:
        return jsonify({"error": "NLP model not loaded"}), 500

if __name__ == '__main__':
    app.run(debug=True) # debug=True allows hot-reloading for development