"""
OCR Service for extracting text from prescription images and PDFs.
Enhanced with preprocessing, Tesseract optimizations, and scanned PDF support.
"""
import re
import logging
from io import BytesIO
from typing import Optional
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
from fastapi import UploadFile, HTTPException

# Configure logger
logger = logging.getLogger(__name__)

# Constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB limit
MIN_TEXT_LENGTH = 10  # Minimum chars to consider valid extraction
TESSERACT_CONFIG = "--oem 3 --psm 6"  # Best OCR mode + assume block of text


def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Preprocess image for better OCR accuracy.
    Converts to grayscale and applies threshold for low contrast/blurry images.
    """
    # Convert to grayscale
    image = image.convert("L")
    
    # Apply adaptive threshold (binarization)
    # Pixels < 140 become black (0), >= 140 become white (255)
    image = image.point(lambda x: 0 if x < 140 else 255, '1')
    
    # Convert back to RGB for Tesseract compatibility
    image = image.convert("RGB")
    
    return image


def extract_text_from_image(image: Image.Image) -> str:
    """
    Extract text from image using Tesseract OCR with optimized config.
    Includes preprocessing for prescription images.
    """
    try:
        # Preprocess image for better accuracy
        image = preprocess_image(image)
        
        # Run OCR with optimized config
        # --oem 3: Use best OCR engine mode
        # --psm 6: Assume a single uniform block of text (perfect for prescriptions)
        text = pytesseract.image_to_string(
            image,
            config=TESSERACT_CONFIG
        )
        
        return clean_extracted_text(text)
    except Exception as e:
        logger.error(f"OCR Error in image extraction: {e}")
        return ""


def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    """
    Extract text from PDF using PyPDF2.
    Falls back to OCR for scanned PDFs (no embedded text).
    """
    try:
        from PyPDF2 import PdfReader
        reader = PdfReader(BytesIO(file_bytes))
        
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
        
        # If no text extracted → likely a scanned PDF, fallback to OCR
        if not text.strip():
            logger.info("PDF has no embedded text, falling back to OCR...")
            try:
                from pdf2image import convert_from_bytes
                images = convert_from_bytes(file_bytes, dpi=200)
                for i, img in enumerate(images):
                    page_text = extract_text_from_image(img)
                    if page_text:
                        text += f"\n--- Page {i+1} ---\n" + page_text
                logger.info(f"OCR extracted {len(text)} chars from scanned PDF")
            except ImportError:
                logger.warning("pdf2image not installed, cannot OCR scanned PDF")
            except Exception as e:
                logger.error(f"OCR fallback error: {e}")
        
        return clean_extracted_text(text)
    
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        return ""


def clean_extracted_text(text: str) -> str:
    """
    Clean up OCR extracted text.
    Preserves medical symbols and useful characters.
    """
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    # Keep medical symbols: - . / , ( ) % ° : + 
    text = re.sub(r'[^\w\s\-./,()%°:+]', '', text)
    return text.strip()


def validate_extraction(text: str) -> Optional[str]:
    """
    Validate extracted text quality.
    Returns warning message if extraction seems poor.
    """
    if not text or len(text.strip()) < MIN_TEXT_LENGTH:
        return f"OCR Warning: Very low text extracted ({len(text) if text else 0} chars)"
    return None


async def perform_ocr(file: UploadFile) -> str:
    """
    Main OCR function that handles images and PDFs.
    Includes file size protection and validation.
    
    Args:
        file: Uploaded file (image or PDF)
        
    Returns:
        Extracted and cleaned text
        
    Raises:
        HTTPException: If file too large or extraction fails
    """
    try:
        content = await file.read()
        
        # File size protection
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Max size: {MAX_FILE_SIZE / (1024*1024):.1f}MB"
            )
        
        file_ext = file.filename.lower().split('.')[-1] if '.' in file.filename else ''
        text = ""
        
        if file_ext in ['pdf']:
            text = extract_text_from_pdf_bytes(content)
            source_type = "PDF"
        elif file_ext in ['png', 'jpg', 'jpeg', 'tiff', 'bmp', 'gif', 'webp']:
            image = Image.open(BytesIO(content))
            text = extract_text_from_image(image)
            source_type = "image"
        else:
            # Try to open as image anyway
            try:
                image = Image.open(BytesIO(content))
                text = extract_text_from_image(image)
                source_type = "file"
            except:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file format: {file_ext}"
                )
        
        # Smart early exit check
        warning = validate_extraction(text)
        if warning:
            logger.warning(warning)
        
        # Log success
        if text and len(text.strip()) >= MIN_TEXT_LENGTH:
            logger.info(f"OCR Success: Extracted {len(text)} chars from {source_type}")
        
        return text
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"OCR Error: {e}")
        return ""
