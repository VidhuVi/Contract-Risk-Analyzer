from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import docx
import PyPDF2

app = Flask(__name__)
CORS(app)

# Load SpaCy model once
try:
    nlp = spacy.load("en_core_web_sm")
    print("SpaCy model 'en_core_web_sm' loaded successfully.")
except Exception as e:
    print(f"Error loading SpaCy model: {e}")
    nlp = None

# --- Helpers ---
def extract_text_from_docx(file_stream):
    try:
        doc = docx.Document(file_stream)
        return '\n'.join([para.text for para in doc.paragraphs])
    except Exception as e:
        print(f"Error extracting DOCX text: {e}")
        return ""

def extract_text_from_pdf(file_stream):
    try:
        reader = PyPDF2.PdfReader(file_stream)
        return '\n'.join([page.extract_text() or '' for page in reader.pages])
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""

# --- Routes ---
@app.route('/')
def hello():
    return 'Hello, Contract Analyzer!'

@app.route('/analyze', methods=['POST'])
def analyze():
    print("--- /analyze route hit ---")

    extracted_text = ""

    if request.is_json and 'text' in request.json:
        extracted_text = request.json['text']
        print("Received plain text.")

    elif 'file' in request.files:
        file = request.files['file']
        filename = file.filename
        print(f"Received file: {filename}")

        if filename.endswith('.txt'):
            extracted_text = file.read().decode('utf-8', errors='ignore')
        elif filename.endswith('.docx'):
            extracted_text = extract_text_from_docx(file)
        elif filename.endswith('.pdf'):
            extracted_text = extract_text_from_pdf(file)
        else:
            return jsonify({"error": "Unsupported file type"}), 400

    else:
        return jsonify({"error": "No text or file provided"}), 400

    if not extracted_text.strip():
        return jsonify({"error": "Could not extract meaningful text from input"}), 400

    if not nlp:
        return jsonify({"error": "NLP model not initialized."}), 500

    doc = nlp(extracted_text)
    num_sentences = len(list(doc.sents))
    num_tokens = len(doc)

    return jsonify({
        "message": "Document processed successfully.",
        "original_text": extracted_text,
        "num_sentences": num_sentences,
        "num_tokens": num_tokens
    })

if __name__ == '__main__':
    app.run(debug=True)
