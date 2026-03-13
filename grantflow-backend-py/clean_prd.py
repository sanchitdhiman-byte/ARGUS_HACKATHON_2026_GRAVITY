import PyPDF2

def main():
    with open("../GrantFlow_PRD.pdf", "rb") as f:
        reader = PyPDF2.PdfReader(f)
        all_text = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            # Join fragmented lines
            lines = text.split('\n')
            cleaned = ' '.join(line.strip() for line in lines if line.strip())
            all_text.append(f"=== PAGE {i+1} ===\n{cleaned}\n")
        
        with open("prd_clean.txt", "w", encoding="utf-8") as out:
            out.write('\n'.join(all_text))
        print(f"Extracted {len(reader.pages)} pages")

if __name__ == "__main__":
    main()
