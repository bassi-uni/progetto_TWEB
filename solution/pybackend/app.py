from flask import Flask

port = 5000


app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


if __name__ == '__main__':
    
    app.run(host='127.0.0.1', port=port, debug=True)
