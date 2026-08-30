import os

unmigrated = []
for root, dirs, files in os.walk('src/app/visualizer'):
    for file in files:
        if file in ['animation.jsx', 'AlgorithmClient.jsx']:
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'from "@/features/algorithms' not in content and "from '@/features/algorithms" not in content:
                    parts = path.replace('\\', '/').split('/')
                    if 'page.jsx' in parts: continue
                    name = '/'.join(parts[3:-1])
                    if name and name not in unmigrated:
                        unmigrated.append(name)

for u in sorted(unmigrated):
    print(u)
