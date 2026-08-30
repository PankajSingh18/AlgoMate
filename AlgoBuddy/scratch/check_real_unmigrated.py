import os

unmigrated = []
for root, dirs, files in os.walk('src/app/visualizer'):
    if 'animation.jsx' in files:
        path = os.path.join(root, 'animation.jsx')
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            if 'from "@/features/algorithms' not in content and "from '@/features/algorithms" not in content:
                unmigrated.append(path.replace('\\', '/'))

for p in unmigrated:
    print(p)
print('Total unmigrated animation.jsx:', len(unmigrated))
