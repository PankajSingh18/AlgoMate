import os

unmigrated = []
for root, dirs, files in os.walk('src/app/visualizer'):
    for file in files:
        if file in ['animation.jsx', 'AlgorithmClient.jsx', 'page.jsx']:
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Check if it imports FSD logic
                if 'from "@/features/algorithms' not in content and "from '@/features/algorithms" not in content:
                    unmigrated.append(path.replace('\\', '/'))

for p in unmigrated:
    print(p)
print('Total unmigrated:', len(unmigrated))
