from fastapi import FastAPI
from pydantic import BaseModel
from langchain.documents import Document
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.document_loaders.text import TextLoader


app = FastAPI()