import sys
import shutil
import os

# Get input path from command line argument
input_path = sys.argv[1]

# Split filename and extension
base, ext = os.path.splitext(input_path)

# Create an enhanced output path (e.g., uploads/photo.jpg → uploads/photo_enhanced.jpg)
output_path = f"{base}_enhanced{ext}"

# Check if the output path is different before copying
if input_path != output_path:
    shutil.copy(input_path, output_path)
    print(f"Enhanced image saved to {output_path}")
else:
    print("Input and output paths are the same. Skipping copy.")
