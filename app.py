from flask import Flask, render_template


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/area-limit")
def area_limit():
    return render_template("area_limit.html")


@app.route("/derivative-integral")
def derivative_integral():
    return render_template("derivative_integral.html")


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
