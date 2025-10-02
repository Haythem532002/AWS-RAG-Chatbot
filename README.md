# 🤖 AWS RAG Chatbot

**Intelligent Documentation Assistant**

A modern RAG (Retrieval-Augmented Generation) chatbot system that provides intelligent answers about AWS services using advanced AI technology, featuring document processing, semantic search, and a beautiful web interface.

[![Python](https://img.shields.io/badge/Python-3.8+-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3.0-1c3c3c?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain.com/)
[![Ollama](https://img.shields.io/badge/Ollama-Latest-ff6b6b?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.ai/)

## 🌟 Features

- 🧠 **Intelligent Q&A** - Advanced RAG system for AWS documentation queries
- � **Document Processing** - Automated PDF parsing and text chunking
- � **Semantic Search** - Vector-based similarity search with ChromaDB
- 💬 **Modern Chat Interface** - Elegant, responsive web UI with real-time chat
- 📊 **Source Attribution** - Detailed source references with confidence scores
- ⚡ **Local AI Models** - Powered by Ollama for privacy and performance
- 🎨 **Beautiful UI** - Glassmorphism design with smooth animations
- � **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🛠️ Tech Stack

**Backend:** Python 3.8+, Flask, LangChain, ChromaDB  
**Frontend:** Next.js 15, TypeScript, Tailwind CSS, React  
**AI/ML:** Ollama, nomic-embed-text, Mistral LLM  
**Vector Database:** ChromaDB with persistence  
**Document Processing:** PyPDF, LangChain Text Splitters  
**API:** RESTful API with CORS support

## 🖼️ System Screenshots

<div align="center">
  <img src="./rag/Capture d'écran 2025-10-02 115121.png" width="400" alt="RAG Chatbot Interface"/>
  <img src="./rag/Capture d'écran 2025-10-02 140024.png" width="400" alt="Chat Conversation Example"/>
</div>

## 🏗️ RAG Architecture

The system follows a modern RAG (Retrieval-Augmented Generation) architecture:

### Core Components

- **� Document Loader** - PDF processing and text extraction from AWS documentation
- **✂️ Text Splitter** - Intelligent chunking with overlap for context preservation
- **� Embedding Function** - Vector embeddings using nomic-embed-text model
- **🗄️ Vector Database** - ChromaDB for efficient similarity search
- **🤖 LLM Integration** - Mistral model via Ollama for response generation
- **🌐 Web Interface** - Next.js frontend with real-time chat capabilities

### Data Flow

1. **� Document Ingestion** - PDF documents are loaded and processed
2. **⚡ Text Processing** - Documents are split into overlapping chunks
3. **🔢 Vectorization** - Text chunks are converted to vector embeddings
4. **� Storage** - Vectors and metadata stored in ChromaDB
5. **� Query Processing** - User queries are embedded and matched against stored vectors
6. **🤖 Response Generation** - Retrieved context is used to generate accurate responses
7. **� UI Display** - Results shown with sources and confidence scores

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- Ollama installed locally
- Git

### Environment Setup

1. **Clone the repository**

```bash
git clone https://github.com/Haythem532002/RAG-Chatbot.git
cd RAG-Chatbot
```

2. **Set up Python virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Python dependencies**

```bash
pip install -r requirements.txt
```

4. **Install and setup Ollama models**

```bash
# Install Ollama (if not already installed)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull required models
ollama pull nomic-embed-text
ollama pull mistral
```

### Running the Application

#### Backend Setup

1. **Process your documents** (one-time setup)

```bash
python load_data.py --reset
```

2. **Start the Flask backend**

```bash
python flask_backend.py
```

The backend will be available at `http://localhost:5000`

#### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd rag-chatbot-frontend
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Start the Next.js development server**

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Quick Test

Test the system via command line:

```bash
python query_data.py "What is Amazon EC2?"
```

Or test the API directly:

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is AWS Lambda?"}'
```

### Service Endpoints

- **🌐 Web Interface**: http://localhost:3000
- **� Flask API**: http://localhost:5000
- **� Health Check**: http://localhost:5000/
- **� Chat API**: http://localhost:5000/api/chat
- **🤖 Ollama Server**: http://localhost:11434

## 📁 Project Structure

```
RAG-Chatbot/
├── data/                           # Source documents directory
│   ├── AWS Certified Cloud Practitioner Slides v2.11.0.pdf
│   └── aws-overview.pdf
├── rag/                           # Project screenshots
│   ├── Capture d'écran 2025-10-02 115121.png
│   └── Capture d'écran 2025-10-02 140024.png
├── chroma/                         # ChromaDB persistence directory
│   └── [vector database files]
├── rag-chatbot-frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── globals.css        # Global styles and animations
│   │   │   ├── layout.tsx         # Root layout with metadata
│   │   │   └── page.tsx           # Main chat page
│   │   └── components/
│   │       └── ChatInterface.tsx  # Main chat component
│   ├── package.json
│   └── tailwind.config.js
├── load_data.py                   # Document processing and vectorization
├── query_data.py                  # Query processing and RAG pipeline
├── embedding_function.py          # Ollama embedding integration
├── flask_backend.py               # REST API server
├── requirements.txt               # Python dependencies
├── venv/                          # Python virtual environment
├── __pycache__/                   # Python cache files
├── .git/                          # Git repository
├── .gitignore                     # Git ignore file
└── README.md                      # Project documentation
```

## 🔧 Configuration

### Customization Options

- **📝 Document Sources**: Add your own PDFs to the `data/` directory
- **🎨 UI Themes**: Modify Tailwind classes in `globals.css`
- **🤖 Models**: Change embedding or LLM models in configuration
- **📊 Chunk Settings**: Adjust chunk size and overlap for different document types
- **🔍 Search Parameters**: Modify similarity thresholds and result counts

## 📡 API Reference

### Chat Endpoint

**POST** `/api/chat`

```json
{
  "message": "What is Amazon S3?"
}
```

**Response:**

```json
{
  "response": "Amazon S3 (Simple Storage Service) is...",
  "sources": ["data/aws-overview.pdf:15:0", "data/aws-overview.pdf:16:1"],
  "context": [
    {
      "content": "Amazon S3 provides...",
      "source": "data/aws-overview.pdf:15:0",
      "score": 0.85,
      "page": "15",
      "file": "data/aws-overview.pdf"
    }
  ],
  "num_sources": 2,
  "query": "What is Amazon S3?",
  "status": "success"
}
```

### Health Check

**GET** `/`

```json
{
  "status": "healthy",
  "message": "RAG Chatbot API is running",
  "endpoints": {
    "chat": "POST /api/chat",
    "health": "GET /"
  }
}
```

## 🧪 Testing

### Run Embedding Tests

```bash
# Comprehensive embedding tests
python test_embeddings.py

# Quick functionality test
python quick_test.py
```

### Test Individual Components

```bash
# Test document loading
python load_data.py

# Test query processing
python query_data.py "test query"

# Test embedding function
python -c "from embedding_function import create_embedding_function; print('Embeddings OK')"
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Install development dependencies (`pip install -r requirements-dev.txt`)
4. Make your changes with proper tests
5. Commit your changes (`git commit -m 'Add AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for frontend development
- Write tests for new features
- Update documentation for API changes
- Use conventional commits for clear history

## � Monitoring and Performance

- **⚡ Response Times**: Typical query response under 2-3 seconds
- **🎯 Accuracy**: High-quality responses with source attribution
- **� Storage**: Efficient vector storage with ChromaDB
- **🔍 Search Quality**: Semantic similarity matching with confidence scores
- **� UI Performance**: Optimized React components with smooth animations

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **🦜 LangChain** for the excellent RAG framework
- **🤖 Ollama** for local AI model hosting
- **⚡ Next.js** for the amazing React framework
- **🎨 Tailwind CSS** for beautiful styling utilities
- **📊 ChromaDB** for efficient vector storage

---

**Built with ❤️ using Modern AI & RAG Architecture**
