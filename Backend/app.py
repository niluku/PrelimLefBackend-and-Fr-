from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import Controllers.prelimLEF as lef  
import platform
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
@app.route('/download', methods=['GET'])
def download_gds():
    try:
        # Use an absolute path or the correct relative path
        gds_file_path = os.path.join(os.getcwd(), 'new.gds')
        
        if os.path.exists(gds_file_path):
            return send_file(gds_file_path, as_attachment=True, mimetype="application/octet-stream")
        else:
            return jsonify({"error": "File not found!"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/prelimlef', methods=['POST'])
def main():
    data = request.json
    print(type(data),"11")
    print("Received data:", data)  # Log the incoming data
    if not data:
        return jsonify({'message': 'No data received'}), 400  # Bad request if no data
    # Process data here
    lef.prelimLEF(data)
    return jsonify({'message': 'Successfully executed'}), 200  # Success response

if __name__ == '__main__':
    app.run(debug=True)
