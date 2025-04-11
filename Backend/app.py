from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import Controllers.prelimLEF as lef  
import platform
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
@app.route('/download', methods=['GET'])
def download_gds():
    # """Get the path for the GDS file based on the operating system and send it for download."""
    # system = platform.system()
    # if system == "Windows":
    #     BASE_DIR = os.path.join(os.path.expanduser("~"), "Downloads")
    # elif system == "Darwin":  # macOS
    #     BASE_DIR = os.path.join(os.path.expanduser("~"), "Documents")
    # else:  # Linux and other systems
    #     BASE_DIR = os.path.join(os.path.expanduser("~"), "Downloads")

    # Define the path for the GDS file
    # gds_filename = os.path.join(BASE_DIR, "prelimLEF.gds")

    # Check if the GDS file exists
    try:
        #sleep(60)
        return send_file("../Downloads/prelimLEF.gds",as_attachment=True,mimetype="application/octet-stream")
    except Exception as e:
        return jsonify({"error":str(e)})

    # if not os.path.exists(gds_filename):
    #     try:
    #         return send_file(gds_filename, as_attachment=True, download_name="prelimLEF.gds", mimetype="application/octet-stream")  # Indicate file not found
    #     except Exception as e:
    #         return jsonify({"error":str(e)})


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
