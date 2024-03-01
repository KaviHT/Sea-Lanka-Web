import os

from flask import Flask, request, jsonify, render_template
import pandas as pd
import joblib
import json

app = Flask(__name__)

# Load your machine learning model
model = joblib.load('RandomForest3.joblib')


def initialize_json_file():
    # Path to the JSON file
    path_to_json = 'static/map_data.json'
    # Initialize the file with an empty list
    with open(path_to_json, 'w') as file:
        json.dump([], file)


# Call the function to initialize the JSON file when the app starts
initialize_json_file()


@app.route('/')
def home():
    # List CSV files in the 'inputs' directory
    csv_files = [f for f in os.listdir('inputs') if f.endswith('.csv')]
    return render_template('index.html', csv_files=csv_files)


@app.route('/predict', methods=['POST'])
def predict():
    # Clear the JSON file
    initialize_json_file()

    selected_file = request.form['selected_file']
    df = pd.read_csv(f'inputs/{selected_file}')
    results = []
    count1 = 0
    count2 = 0
    for _, row in df.iterrows():

        count1 += 1
        print("looped: ", count1)

        dayofyear = pd.to_datetime(row['date']).dayofyear
        features = [[dayofyear, row['lat'], row['lon'], row['chl'], row['sst']]]
        prediction = model.predict(features)
        if prediction[0] == 1:
            count2 += 1
            print("predicted: ", count2)
            results.append({'name': f"{row['lat']}, {row['lon']}", 'lat': row['lat'], 'lon': row['lon']})

    # Write results to a JSON file in the static directory
    with open('static/map_data.json', 'w') as json_file:
        json.dump(results, json_file)

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
