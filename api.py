import sqlite3
from flask import Flask, render_template, request, Response, jsonify
import mysql.connector
from flask import Flask
from flask import request
from mysql.connector import Error
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def connexion_db():
    connection = mysql.connector.connect(host='localhost',
                                         database='todolist',
                                         user='root',
                                         port=3306,
                                         password='')
    connection.paramstyle = "qmark"
    return connection


########################################################################## *** DATABASE *** #######################################################################################

try:
    connection = connexion_db()
    if connection.is_connected():
        db_Info = connection.get_server_info()
        print("Connected to MySQL Server version ", db_Info)
        cursor = connection.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
        print("You're connected to database: ", record)

        mySql_Create_Table_Query = """CREATE TABLE IF NOT EXISTS todo ( 
                             Id int(11) NOT NULL AUTO_INCREMENT,
                             title text(250) NOT NULL,
                             description text(255) NOT NULL,
                             deadline varchar(20) NOT NULL,
                             done int(2) NOT NULL,
                             PRIMARY KEY (Id)) """

    cursor = connection.cursor()
    result = cursor.execute(mySql_Create_Table_Query)
    print("Todo Table created successfully ")

except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    if (connection.is_connected()):
        cursor.close()
        connection.close()
        print("MySQL connection is closed")
        

########################################################################## *** ROUTE *** #######################################################################################
#Route to main page
@app.route('/')
@cross_origin()
def hello_world():
    return 'Hello, World!'

#Get route to specific todo

@app.route('/todolist/<int:id>', methods=['GET'])
def todos(id):

    connection = connexion_db()

    cursor = connection.cursor()

    sql_select_Query = "SELECT * FROM todo WHERE id="+str(id)
    cursor.execute(sql_select_Query)
    records = cursor.fetchone()

    json_list = json.dumps(records, ensure_ascii = False).encode("utf8")

    return Response(json_list, mimetype = "text/json")

#Get/post route to todo(s)

@app.route('/todolist', methods=['GET'])
@cross_origin()
def todo():

    connection = connexion_db()

    cursor = connection.cursor()

    sql_select_Query = "select * from todo"

    cursor.execute(sql_select_Query)
    records = cursor.fetchall()

    json_list = json.dumps(records, ensure_ascii = False).encode("utf8")

    return Response(json_list, mimetype = "text/json")


@app.route('/todolist/post', methods=['POST'])
@cross_origin()
def post():

    connection = connexion_db()

    cursor = connection.cursor()

    print(request.is_json)
    params = request.get_json()

    title = params['title']
    desc = params['desc']
    deadline = params['deadline']
    done = params['done']

    sql_select_Query = "INSERT INTO todo(title, description, deadline, done) VALUES (%s, %s, %s, %s)" 
    var = (title, desc, deadline, done)

    cursor.execute(sql_select_Query, var)
    return "ok"



#Get route to specific date
@app.route('/todolist/', methods=['GET'])
@cross_origin()
def getDateTodo():
    param = request.args.get('date')

    if param is not None:
        return "ca marche"
    else :
        return "ca marche pas"


#Update route to specific todo
@app.route('/todolist/<int:id>', methods=['PUT'])
@cross_origin()
def updateTodo(id):

    connection = connexion_db()

    cursor = connection.cursor()

    if request.method == 'PUT':

        params = request.get_json()

        title = params['title']
        desc = params['desc']
        deadline = params['deadline']
        done = params['done']
        print(title)

        sql_select_Query = "UPDATE todo SET title =%s, description=%s, deadline=%s, done=%s WHERE id=%s" 
        var = (title, desc, deadline, done, id)

        cursor.execute(sql_select_Query, var)
        return "ok"


#Delete route to specific todo
@app.route('/todolist/<int:id>', methods=['DELETE'])
@cross_origin()
def deleteTodo(id):

    connection = connexion_db()

    cursor = connection.cursor()

    if request.method == 'DELETE':

        sql_select_Query = "DELETE FROM todo WHERE id=%s" 
        var = [id]

        cursor.execute(sql_select_Query, var)
        return "ok"

if __name__ == '__main__':                
    app.run(host='0.0.0.0', port=8080)