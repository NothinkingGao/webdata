from flask import Flask, render_template
import csv

app = Flask(__name__)

@app.route('/')
def index():
    with open('baise.csv', 'r') as file:
        data = list(csv.reader(file))
    return render_template('index.html', data=data)

if __name__ == '__main__':
    app.run(debug=True)
