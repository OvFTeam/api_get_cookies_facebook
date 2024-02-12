from flask import Flask, jsonify, make_response, request

from modules import check_status_facebook

app = Flask(__name__)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/check_facebook_status', methods=['GET'])
def check_facebook_status():
    username = request.args.get('username')
    password = request.args.get('password')
    code = request.args.get('code')
    if not username or not password:
        response = make_response(
            jsonify({'error': 'Vui long cung cap ten nguoi dung va mat khau'}))
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        return response
    if not code:
        status, cookies = check_status_facebook(username, password, None)
        return jsonify({'status': status, 'cookies': cookies})
    else:
        status, cookies = check_status_facebook(username, password, code)
        return jsonify({'status': status, 'cookies': cookies})

if __name__ == '__main__':
    app.run(debug=True)
