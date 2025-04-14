from flask import Flask, request, jsonify
from flask_cors import CORS
from api.routes import api_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Register API routes
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def index():
    return jsonify({"message": "Signal Flow Graph Analysis API"})

if __name__ == '__main__':
    app.run(debug=True)