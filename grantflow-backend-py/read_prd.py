import PyPDF2

def main():
    with open("../GrantFlow_PRD.pdf", "rb") as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        with open("prd_output.txt", "w", encoding="utf-8") as out:
            out.write(text)

if __name__ == "__main__":
    main()
