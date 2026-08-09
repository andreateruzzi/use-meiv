import os
from PIL import Image
from pillow_heif import register_heif_opener

register_heif_opener()

def convert_images(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            # Convert HEIC to JPG
            if file.lower().endswith('.heic'):
                try:
                    img = Image.open(file_path)
                    new_path = os.path.splitext(file_path)[0] + '.jpg'
                    img.save(new_path, "JPEG")
                    print(f"Converted {file} to JPG.")
                    os.remove(file_path) # remove original HEIC
                except Exception as e:
                    print(f"Error converting {file}: {e}")
                    
            # Convert PNG to JPG (optional, to save space, but keeping PNG is fine)

if __name__ == "__main__":
    public_dir = os.path.join(os.getcwd(), 'public', 'images')
    if os.path.exists(public_dir):
        convert_images(public_dir)
    else:
        print("Directory not found")
