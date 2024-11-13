from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin
cred = credentials.Certificate('config/investoriq-79baa-firebase-adminsdk-k34ya-6eac8df930.json')
initialize_app(cred)
db = firestore.client()

@app.route('/api/properties', methods=['GET'])
def get_properties():
    try:
        properties_ref = db.collection('properties')
        properties = [doc.to_dict() for doc in properties_ref.stream()]
        return jsonify(properties), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/properties', methods=['POST'])
def add_property():
    try:
        data = request.json
        doc_ref = db.collection('properties').document()
        data['id'] = doc_ref.id
        doc_ref.set(data)
        return jsonify({"id": doc_ref.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/advisor-requests', methods=['GET'])
def get_advisor_requests():
    try:
        requests_ref = db.collection('advisor_requests')
        requests = [doc.to_dict() for doc in requests_ref.stream()]
        return jsonify(requests), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/advisor-requests', methods=['POST'])
def create_advisor_request():
    try:
        data = request.json
        doc_ref = db.collection('advisor_requests').document()
        data['id'] = doc_ref.id
        data['status'] = 'pending'
        doc_ref.set(data)
        return jsonify({"id": doc_ref.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/advisor-requests/<request_id>', methods=['PUT'])
def update_advisor_request(request_id):
    try:
        data = request.json
        db.collection('advisor_requests').document(request_id).update(data)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)