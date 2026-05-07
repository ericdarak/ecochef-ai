# EcoChef AI

EcoChef AI is a React-based platform that helps users reduce food waste by suggesting recipes based on ingredients they already have at home.

Users can enter available ingredients, approximate expiration dates, and personal preferences. The AI suggests recipes, estimates the risk of food waste, and shows the approximate environmental impact.

---

## Live Demo

- Frontend: COLE_AQUI_SUA_URL_DA_VERCEL
- Backend API: https://ecochef-ai.onrender.com
- API Documentation: https://ecochef-ai.onrender.com/docs

---

## Features

- Ingredient input
- Expiration date estimation
- User preference selection
- AI-powered recipe recommendation
- Food waste risk classification
- Urgent ingredients detection
- Approximate environmental impact calculation
- Responsive React interface
- FastAPI backend
- Scikit-learn machine learning model
- Online deployment with Vercel and Render

---

## Technologies Used

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Python
- FastAPI
- Pandas
- Scikit-learn
- Joblib
- Uvicorn

### Machine Learning

- TF-IDF Vectorization
- Logistic Regression
- Text Classification

### Deployment

- Vercel
- Render

---

## Project Structure

```txt
ecochef-ai/
│
├── backend/
│   ├── data/
│   │   └── recipes.csv
│   │
│   ├── models/
│   │   └── recipe_model.joblib
│   │
│   ├── main.py
│   ├── train_model.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── README.md
└── .gitignore
```

---

## How It Works

1. The user enters the ingredients available at home.
2. The user adds the approximate number of days before each ingredient expires.
3. The user selects a preference such as quick, healthy, cheap, or vegetarian.
4. The frontend sends the information to the FastAPI backend.
5. The backend processes the input.
6. A Scikit-learn model predicts the most suitable recipe category.
7. The system recommends recipes based on ingredient matching, user preference, and predicted category.
8. The application estimates the food waste risk.
9. The app displays the approximate environmental impact.

---

## Running the Project Locally

To run this project locally, you need to run the backend and frontend separately.

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Train the machine learning model:

```bash
python train_model.py
```

Run the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will run at:

```txt
http://127.0.0.1:8000
```

FastAPI documentation will be available at:

```txt
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Open another terminal and go to the frontend folder:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder and add:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run the React project:

```bash
npm run dev
```

The frontend will run at:

```txt
http://localhost:5173
```

---

## Main Functionalities

### Ingredient Form

The user can add multiple ingredients and define how many days are left before each ingredient expires.

### Preference Selection

The user can select a preference:

- Quick
- Healthy
- Cheap
- Vegetarian

### Recipe Recommendation

The backend recommends recipes based on:

- Ingredients entered by the user
- User preference
- Predicted recipe category
- Ingredient similarity

### Waste Risk Estimation

The system estimates food waste risk based on expiration dates:

- 0 to 1 day: High risk
- 2 to 3 days: Medium risk
- More than 3 days: Low risk

### Environmental Impact

The system calculates an approximate environmental impact based on the estimated CO₂ equivalent that could be saved by using the ingredients.

---

## Future Improvements

- Add PyTorch image classification for ingredient recognition
- Allow users to upload food images
- Add user authentication
- Save recipe history
- Add nutritional information
- Improve the machine learning model with a larger dataset
- Add a dashboard with charts and user history

---

## What I Learned

During this project, I practiced:

- Building a React application with Vite
- Creating a REST API with FastAPI
- Connecting frontend and backend
- Training a basic machine learning model with Scikit-learn
- Saving and loading models with Joblib
- Structuring a full-stack AI project
- Deploying a frontend application on Vercel
- Deploying a backend API on Render

---

## Author

Developed by Eric Darakjian.