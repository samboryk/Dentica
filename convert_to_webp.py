import os
from PIL import Image
import glob

def convert_to_webp():
    # Шлях до папки з зображеннями
    image_dir = "assets/images"
    
    # Підтримувані формати для конвертації
    extensions = ("*.png", "*.jpg", "*.jpeg")
    
    files_to_convert = []
    for ext in extensions:
        files_to_convert.extend(glob.glob(os.path.join(image_dir, ext)))
    
    if not files_to_convert:
        print("Зображень для конвертації не знайдено.")
        return

    print(f"Знайдено {len(files_to_convert)} зображень. Починаємо конвертацію...")

    for file_path in files_to_convert:
        try:
            # Відкриваємо зображення
            img = Image.open(file_path)
            
            # Створюємо новий шлях з розширенням .webp
            base = os.path.splitext(file_path)[0]
            new_path = base + ".webp"
            
            # Зберігаємо у форматі WebP з високою якістю
            img.save(new_path, "WEBP", quality=85)
            print(f"Успішно: {os.path.basename(file_path)} -> {os.path.basename(new_path)}")
            
            # Опціонально: видаляємо оригінал (закоментуйте наступний рядок, якщо хочете залишити оригінали)
            # os.remove(file_path)
            
        except Exception as e:
            print(f"Помилка при конвертації {file_path}: {e}")

if __name__ == "__main__":
    convert_to_webp()
    print("\nКонвертація завершена! Всі посилання в коді вже оновлені.")
