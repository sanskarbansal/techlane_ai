import sys
import json
import numpy as np
from sklearn.linear_model import LinearRegression

def predict_salary(years_of_experience):
    model = LinearRegression()
    # Sample data for demonstration
    years = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).reshape(-1, 1)
    salaries = np.array([90000, 110000, 130000, 150000, 170000, 180000, 190000, 240000, 250000, 350000])
    model.fit(years, salaries)
    predicted_salary = model.predict(np.array([years_of_experience]).reshape(-1, 1))
    return predicted_salary[0]

if __name__ == "__main__":
    years_of_experience = int(sys.argv[1])
    result = predict_salary(years_of_experience)
    print(result)
