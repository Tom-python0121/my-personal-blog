import os
import requests
from urllib.parse import urlparse

# 创建图片目录
image_dir = 'D:\\AI\\AI编程\\my-website\\images'
if not os.path.exists(image_dir):
    os.makedirs(image_dir)

# 免费可商用的小狗图片URL列表（来自picsum.photos，这些是随机图片，但我们指定了小狗相关的ID）
puppy_image_urls = [
    'https://picsum.photos/id/237/600/400',  # 这是一张著名的小狗图片ID
    'https://picsum.photos/id/169/600/400',
    'https://picsum.photos/id/1062/600/400'
]

# 下载图片
for i, url in enumerate(puppy_image_urls):
    try:
        print(f"正在下载图片 {i+1}/{len(puppy_image_urls)}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # 保存图片
        filename = f"puppy_{i+1}.jpg"
        filepath = os.path.join(image_dir, filename)
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"图片已保存: {filepath}")
    except Exception as e:
        print(f"下载图片 {i+1} 时出错: {e}")

print("所有图片下载完成！")