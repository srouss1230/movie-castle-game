from flask import Flask, render_template, request, jsonify
from datetime import datetime
from flask_mysqldb import MySQL
from configparser import ConfigParser
import tmdbsimple as tmdb
import random

app = Flask(__name__)
config_object = ConfigParser()
config_object.read("config.ini")

tmdb.API_KEY = config_object["TMDB-LOGIN"]["APIkey"]

auth = tmdb.Authentication()
token = auth.token_new()
print(token["expires_at"])
auth.token_validate_with_login(request_token=token['request_token'],username=config_object["TMDB-LOGIN"]["user"],password=config_object["TMDB-LOGIN"]["pass"])
if auth.success:
    print("IT WORKED!")
    print(token['request_token'])
    session = auth.session_new(request_token=token['request_token']) # sets up the session
    session_id = session['session_id']
    account = tmdb.Account(session_id) # sets up the account associated with the session
    account.info()
    list_id = account.lists()['results'][0]['id']
    movieList = tmdb.Lists(list_id, session_id) # retuns the TMDB list object
    movieArr = movieList.info()['items'] # this is the array of the movies which is returned by Get Details in API
    listSize = movieList.info()['item_count'] # this is the number of movies in the array

app.run(debug = True)