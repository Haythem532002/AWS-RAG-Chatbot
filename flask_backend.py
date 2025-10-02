from flask import Flask, request, jsonify
from flask_cors import CORS
from query_data import query_rag  # Import your existing function
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "message": "RAG Chatbot API is running",
        "endpoints": {
            "chat": "POST /api/chat",
            "health": "GET /"
        }
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint using your existing query_rag function"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({"error": "Missing 'message' in request body"}), 400
        
        query_text = data['message']
        
        if not query_text.strip():
            return jsonify({"error": "Empty message"}), 400
        
        logger.info(f"Processing query: {query_text}")
        
        # Use your existing query_rag function (now returns detailed info)
        result = query_rag(query_text)
        
        logger.info("Query processed successfully")
        
        # Add status to the result
        if isinstance(result, dict):
            result["status"] = "success"
        else:
            # Fallback if result is just a string (shouldn't happen with new version)
            result = {
                "response": result,
                "status": "success",
                "sources": [],
                "context": [],
                "num_sources": 0
            }
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    print("🚀 Starting RAG Chatbot API...")
    print("📊 Health check: http://localhost:5000/")
    print("💬 Chat endpoint: POST http://localhost:5000/api/chat")
    print("\n� Example request:")
    print('curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d \'{"message": "what is EC2"}\'')
    
    app.run(host='0.0.0.0', port=5000, debug=True)