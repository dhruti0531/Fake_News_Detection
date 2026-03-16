import os
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

print("Generating mock ML models...")

# 1. Create a dummy dataset
corpus = [
    "Federal Reserve Announces Interest Rate Hike of 0.25%",
    "Shocking: Secret Alien Bunker Found Under the White House!!",
    "New Study Links Daily Coffee Consumption to Longer Lifespan",
    "Local Man Discovers Infinite Energy Glitch Using Only Lemons MIRACLE",
    "UN General Assembly Approves New Climate Change Resolution",
    "SpaceX Successfully Lands Starship on Mars"
]
labels = [0, 1, 0, 1, 0, 0] # 0 = Real, 1 = Fake

# 2. Train a dummy Vectorizer
vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
X = vectorizer.fit_transform(corpus)

# 3. Train a dummy Model
model = LogisticRegression()
model.fit(X, labels)

# 4. Save the files (.pkl)
models_dir = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(models_dir, exist_ok=True)

joblib.dump(vectorizer, os.path.join(models_dir, 'vectorizer.pkl'))
joblib.dump(model, os.path.join(models_dir, 'model.pkl'))

print(f"Models saved successfully to {models_dir}")
