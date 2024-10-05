# from glob import glob
from flask import Flask, render_template, request, jsonify
from datetime import datetime
from flask_mysqldb import MySQL
from configparser import ConfigParser
import tmdbsimple as tmdb # don't forget that we are using a tmdb python wrapper
import random
import os


# print("Start of app.py")


app = Flask(__name__)
config_object = ConfigParser()
config_object.read("config.ini")


tmdb.API_KEY = config_object["TMDB-LOGIN"]["APIkey"]
# tmdb.API_KEY = "fe80472bacff902901720dcdaf98e60c" # sets up the API Key in the py API

# log in to mysql account and db
# app.config['MYSQL_HOST'] = 'us-cdbr-east-05.cleardb.net'
# app.config['MYSQL_USER'] = 'b59a6005561b64'
# app.config['MYSQL_PASSWORD'] = '6cda5fdf'
# app.config['MYSQL_DB'] = 'heroku_0cdf3077be5e51c'

app.config['MYSQL_HOST'] = 'wiad5ra41q8129zn.cbetxkdyhwsb.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'pekj2na67cxiside'
app.config['MYSQL_PASSWORD'] = 'p5ivp45zjhljkmyw'
app.config['MYSQL_DB'] = 'r84c7iat5psdybvj'
app.config['MYSQL_PORT'] = 3306


# set up all global vars
actor1 = "temp"
actor2 = "temp"
actor3 = "temp"
actor4 = "temp"
actor5 = "temp"
director = "temp"
movieTitle = "temp"
movieDesc = "temp"
posterPath = "temp"
movieRecommended1 = "temp"
movieRecommended2 = "temp"
movieRecommended3 = "temp"
listSize = 1
movieArr = {}
session_id = 0
list_id = 0

def setUpTmdb():
    global listSize
    global movieArr
    global session_id
    global list_id
    # set up the link with TMDB and the account
    auth = tmdb.Authentication()
    token = auth.token_new()
    # print(token["expires_at"])
    auth.token_validate_with_login(request_token=token['request_token'],username=config_object["TMDB-LOGIN"]["user"],password=config_object["TMDB-LOGIN"]["pass"])
    # if auth.success:
    #     print("SUCCESS")
    # else:
    #     print("¯\_(ツ)_/¯")

    try:
        # print(token['request_token'])
        session = auth.session_new(request_token=token['request_token']) # sets up the session
        session_id = session['session_id']
        account = tmdb.Account(session_id) # sets up the account associated with the session
        account.info()

        # to avoid the hardcoding you should look into just calling account.lists first and you can look at the code for that function to see what it does in this API
        list_id = account.lists()['results'][1]['id']
        # list_id = 8199681
        movieList = tmdb.Lists(list_id, session_id) # retuns the TMDB list object
        movieArr = movieList.info()['items'] # this is the array of the movies which is returned by Get Details in API
        listSize = movieList.info()['item_count'] # this is the number of movies in the array
        
    except Exception as e:
        print(e)
        # print("IT DIDN'T WORK")
        pass


# setUpTmdb()


mysql = MySQL(app)

# a function that handles all query code with an input of the query string
def executeQuery(query, args=None):
    cursor = mysql.connection.cursor()
    cursor.execute(query, args)
    if query.upper().startswith('SELECT'):
        data = cursor.fetchone()
    else:
        mysql.connection.commit()
        data = None
    cursor.close()
    return data

#a function to either search TMDB or MySQL for today's movie
def findMovie():
    global actor1
    global actor2
    global actor3
    global actor4
    global actor5
    global director
    global movieTitle
    global movieDesc
    global posterPath
    global movieRecs
    global movieRecommended1
    global movieRecommended2
    global movieRecommended3
    today = datetime.today().strftime('%Y-%m-%d') # sets the today variable to today in the specific string format

    # selects the movie data from SQL for today's date
    row = executeQuery(f'''SELECT actor1, actor2, actor3, actor4, actor5, director, title, movieDesc, posterPath, movieRecommended1, movieRecommended2, movieRecommended3, actor1ID, actor2ID, actor3Id, actor4ID, actor5ID, directorID, movieRecommended1ID, movieRecommended2ID, movieRecommended3ID from movies WHERE date=\'{today}\'''')
    

    # if nothing was returned, pull from TMDB
    if row == None:
        setUpTmdb()
        todayMovieIndex = random.randrange(0, listSize)
        listPage = todayMovieIndex // 20
        listIndex = todayMovieIndex % 20
        movieList = tmdb.Lists(list_id, session_id)
        movieArr = movieList._GET(f'list/{list_id}?page={listPage+1}')['items']
        print(f'listSize: {listSize}')
        print(f'todayMovieIndex: {todayMovieIndex}')
        print(f'movieArr: {movieArr}')
        movie = movieArr[listIndex]
        movieID = movie['id']
        todaysMovie = tmdb.Movies(movieID)
        todaysMovieInfo = todaysMovie.info()
        movieTitle = todaysMovieInfo['original_title']
        credits = todaysMovie.credits()
        
        movieDesc = todaysMovieInfo["tagline"]
        posterPath = todaysMovieInfo["poster_path"]
        movieRecs = todaysMovie.recommendations()
        movieRecommended1 = movieRecs['results'][0]["original_title"]
        movieRecommended2 = movieRecs['results'][1]["original_title"]
        movieRecommended3 = movieRecs['results'][2]["original_title"]

        #THIS PART MAY BREAK IT. IDK IF THE ID thing works
        movieRecommended1ID= movieRecs['results'][0]["id"]
        movieRecommended2ID = movieRecs['results'][1]["id"]
        movieRecommended3ID = movieRecs['results'][2]["id"]
        
        # these are ordered in 3rd billed, 4th billed, 5th billed, 2nd billed, 1st billed, director
        actor1 = credits['cast'][2]['name']
        actor2 = credits['cast'][3]['name']
        actor3 = credits['cast'][4]['name']
        actor4 = credits['cast'][1]['name']
        actor5 = credits['cast'][0]['name']

       # these grab the ids for the actors
        actor1ID = credits['cast'][2]['id']
        actor2ID = credits['cast'][3]['id']
        actor3ID = credits['cast'][4]['id']
        actor4ID = credits['cast'][1]['id']
        actor5ID = credits['cast'][0]['id']

        #theoretically the images should be  https://api.themoviedb.org/3/person/{person_id}/images[profiles][0][file_path]

        directorFound = False
        i = 0
        while not directorFound:
            job = credits['crew'][i]['job']
            if job == 'Director':
                # director name and id
                director = credits['crew'][i]['name']
                directorID = credits['crew'][i]['id']
                directorFound = True
            i += 1
        
        # delete from the list
        test = movieList.remove_item(media_id=movieID)
        print(test['status_message'])

        # then insert into SQL
        executeQuery(f'''INSERT INTO movies(title, actor1, actor2, actor3, actor4, actor5, director, date, movieDesc, posterPath, 
                     movieRecommended1, movieRecommended2, movieRecommended3, actor1ID, actor2ID, actor3ID, actor4ID, actor5ID, 
                     directorID, movieRecommended1ID, movieRecommended2ID, movieRecommended3ID)
             VALUES (\'{movieTitle}\',\'{actor1}\',\'{actor2}\',\'{actor3}\',\'{actor4}\',\'{actor5}\',\'{director}\',
             \'{today}\', \'{movieDesc}\' , \'{posterPath}\', \'{movieRecommended1}\', \'{movieRecommended2}\', 
             \'{movieRecommended3}\',\'{actor1ID}\',\'{actor2ID}\',\'{actor3ID}\',\'{actor4ID}\',\'{actor5ID}\',
             \'{directorID}\', \'{movieRecommended1ID}\', \'{movieRecommended2ID}\', \'{movieRecommended3ID}\')''')
        
        #im just making this table so that at midnight ill be able to check if this is the best way to get the paths. Cause if so, I'll add it into the other table. 
        #so to clarify, if it would work, I'll save the ids into the SQL instead of the names. Then I'll use the ids to get the paths and also any other info we need. 
        # It'll be cleaner
        executeQuery(f'''INSERT INTO actors(actor1ID,actor2ID,actor3ID,actor4ID,actor5ID,directorID,movieDay) VALUES 
                     (\'{actor1ID}\', \'{actor2ID}\', \'{actor3ID}\', \'{actor4ID}\', \'{actor5ID}\', \'{directorID}\', \'{today}\')''')
       
    else:

        # otherwise, pull the data from the row into the global variables

        actor1 = row[0]
        actor2 = row[1]
        actor3 = row[2]
        actor4 = row[3]
        actor5 = row[4]
        director = row[5]
        movieTitle = row[6]
        movieDesc = row[7]
        posterPath = "https://image.tmdb.org/t/p/w185" + row[8]
        movieRecommended1 = row[9]
        movieRecommended2 = row[10]
        movieRecommended3 = row[11]
        actor1ID = row[12]
        actor2ID = row[13]
        actor3ID = row[14]
        actor4ID = row[15]
        actor5ID = row[16]
        directorID = row[17]
        movieRecommended1ID = row[18]
        movieRecommended2ID = row[19]
        movieRecommended3ID = row[20]

        #seeing if i can get the actor file path. May have to re-input the code to start a session
        test = tmdb.People(actor1ID, session_id)
        print("****************")
        print("****************")
        print("****************")
        print(test.info())
        #  print(test.images().profiles[0]['file_path'])
        print("****************")
        print("****************")
        print("****************")


# run at the start, finds today's movie then passes through all necessary info
@app.route('/')
def home():

    findMovie()
    return render_template('castle.html', title='Cast.le', actor1=actor1, actor2=actor2, actor3=actor3, actor4=actor4, actor5=actor5, director=director, movieTitle=movieTitle,movieDesc=movieDesc, posterPath=posterPath, movieRecommended1=movieRecommended1, movieRecommended2=movieRecommended2, movieRecommended3=movieRecommended3)


# check a guess that is passed through to see if it matches what is in the db
@app.route('/guess', methods=["POST"])
def checkGuess():
    guess = request.form.get("guess").lower()
    today = datetime.today().strftime('%Y-%m-%d')
    row = executeQuery(f'''SELECT * from movies WHERE UPPER(title)=UPPER(\'{guess}\') AND date=\'{today}\'''')
    if row == None:
        correct = False
    else:
        correct = True
    return jsonify(correct=correct)


# check if the log in info was correct
@app.route('/login', methods=["POST"])
def logInUser():
    username = request.form.get("username")
    password = request.form.get("password")
    row = executeQuery(f'''SELECT * from users WHERE username=\'{username}\' AND password=\'{password}\'''')
    if row == None:
        loggedIn = False
    else:
        loggedIn = True
    return jsonify(loggedIn=loggedIn)


# insert the new user into the db
@app.route('/register', methods=["POST"])
def registerUser():
    username = request.form.get("username")
    password = request.form.get("password")
    executeQuery(f'''INSERT INTO users (username, password, wins, plays, winsIn1, winsIn2, winsIn3, winsIn4, winsIn5, winsIn6) VALUES (\'{username}\', \'{password}\', 0,0,0,0,0,0,0,0)''')
    registered = True
    return jsonify(registered=registered)


# update the user's stats and then pass through the updated stats
@app.route('/updateStats', methods=["POST"])
def updateStats():
    username = request.form.get("username")
    guessNum = request.form.get("guessNum")
    gameWon = request.form.get("gameWon")
    if gameWon == "true":
        executeQuery(f'''UPDATE users SET wins = wins + 1, plays = plays + 1, winsIn{guessNum} = winsIn{guessNum} + 1 WHERE username = \'{username}\'''')
    else:
        executeQuery(f'''UPDATE users SET plays = plays + 1 WHERE username = \'{username}\'''')
    
    results = executeQuery(f'''SELECT plays, wins, winsIn1, winsIn2, winsIn3, winsIn4, winsIn5, winsIn6 from users WHERE username = \'{username}\'''')
    return jsonify(plays=results[0], wins=results[1], winsIn1=results[2], winsIn2=results[3], winsIn3=results[4], winsIn4=results[5], winsIn5=results[6], winsIn6=results[7])

@app.route('/test')
def test():
    return "test"


# run the app
# app.run(debug=True, port=3456, host='0.0.0.0')
port = int(os.getenv('PORT', 5000))
if __name__ == '__main__':
    app.run(debug=True)