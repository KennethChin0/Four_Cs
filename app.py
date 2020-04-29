from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def home():
    return(render_template('homepage.html'))


@app.route("/stats")
def stats():
    return(render_template("stats.html"))

@app.route("/compare")
def compare():
    return(render_template("compare.html"))

if __name__ == "__main__":
    app.debug=True
    app.run()
