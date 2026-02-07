
import json

def extract_code(notebook_path):
    with open(notebook_path, 'r', encoding='utf-8') as f:
        nb = json.load(f)
    
    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            print(f"# Code Cell")
            print("".join(cell['source']))
            print("\n" + "="*40 + "\n")

        elif cell['cell_type'] == 'markdown':
            # Skip markdown to keep it clean, or include if needed.
            # print(f"# Markdown Cell") 
            # print("".join(cell['source']))
            # print("\n" + "="*40 + "\n")
            pass

    with open('notebook_code.py', 'w', encoding='utf-8') as f:
        for cell in nb['cells']:
            if cell['cell_type'] == 'code':
                f.write(f"# Code Cell\n")
                f.write("".join(cell['source']))
                f.write("\n" + "="*40 + "\n")

if __name__ == "__main__":
    extract_code('Crying_Cause_Detection.ipynb')
