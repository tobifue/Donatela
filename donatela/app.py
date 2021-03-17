from flask import Flask, render_template
#from flask_pymongo import PyMongo

from flask_graphql import GraphQLView
from flask_mongoengine import MongoEngine
from mongoengine import connect
from schema import schema
from flask_graphql_auth import (
    GraphQLAuth,
)

app = Flask(__name__)

app.config["SECRET_KEY"] = "something"
app.config["JWT_SECRET_KEY"] = "something"  # we could maybe change this later
app.config["REFRESH_EXP_LENGTH"] = 120
app.config["ACCESS_EXP_LENGTH"] = 60

app.config['MONGODB_SETTINGS'] = {
    'db': 'donatela',
    'host':'mongodb+srv://rudi:gJEzkg3a094nVORu@cluster0.ebgvt.mongodb.net/donatela?retryWrites=true&w=majority', 
    'alias': 'default',
    'ssl': True,
    'ssl_cert_reqs': 'CERT_NONE',
    'connect': False
}

db = MongoEngine(app)
auth = GraphQLAuth(app)

#connect('donatela', host='mongodb://localhost:27017/donatela', alias='default')
#connect('donatela', host='mongodb+srv://rudi:gJEzkg3a094nVORu@cluster0.ebgvt.mongodb.net/donatela?retryWrites=true&w=majority', alias='default', ssl=True,ssl_cert_reqs='CERT_NONE')

#app.config['MONGO_DBNAME'] = "donatela"
#app.config['MONGO_URI'] = "mongodb://localhost:27017/donatela" 

#mongo = PyMongo(app)

@app.route('/')
def index():
    return render_template('index.html')

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True)
)


if __name__ == '__main__':
    app.run(debug=True)
