#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- Import CORS
import json

app = Flask(__name__)
CORS(app, origins=["https://jesusfreaks.netlify.app"])  # <-- Enable CORS for all routes


# Temporary JSON file storage (replace with a real database later)
SCHEDULE_FILE = "Json/schedule.json"

def load_schedule():
    try:
        with open(SCHEDULE_FILE, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_schedule(data):
    with open(SCHEDULE_FILE, "w") as file:
        json.dump(data, file, indent=4)

@app.route("/get-schedule", methods=["GET"])
def get_schedule():
    return jsonify(load_schedule())

@app.route("/save-schedule", methods=["POST"])
def save_schedule_data():
    data = request.json
    save_schedule(data)
    return jsonify({"message": "Schedule saved successfully!"})

if __name__ == "__main__":
    import os
    port = int(os.getenv('PORT', 5000))
    app.run(host = "0.0.0.0", port= port, debug=True)

