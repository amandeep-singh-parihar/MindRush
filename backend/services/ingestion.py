from langchain_community.document_loaders import PyMuPDFLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


def load_pdf(file_path: str):
    """Load a PDF file and return a list of LangChain Document objects."""
    loader = PyMuPDFLoader(file_path)
    return loader.load()


def split_docs(documents, chunk_size: int = 500, chunk_overlap: int = 50):
    """Split documents into smaller chunks for embedding."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    return splitter.split_documents(documents)
