from flask import Flask, request, Response, session, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from uuid import uuid4
from pymongo import MongoClient
from config import MONGO_URI
from datetime import timedelta
from flask_socketio import SocketIO

# from flask_session import Session
import json

import json
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")
cors = CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)
client = MongoClient(MONGO_URI)
db = client.HallBooking
app.secret_key = 'your_secret_key_here'
app.permanent_session_lifetime = timedelta(days=7)



class Home(Resource):
    def get(self):
        return "Get Request"
    
    def post(self):
        data = request.get_json()
        print(data)
        return "Post Request"
    
"""
    Rooms Class to handle room related functionality.
"""

class Utility():
    @staticmethod
    def getRooms():
        db_res = db.rooms.find({}, {'_id': 0})
        
        return jsonify(list(db_res))
    
    @staticmethod
    def getSessionUsers(token):
        db_res = db.session.find({"session_id": token}, {})
        user = [x["session_id"] for x in db_res]
        return len(user) == 1
        
class Rooms(Resource):
    def get(self):
        return Utility.getRooms()

class BookRoom(Resource): 
    def post(self): 
        token = request.headers.get("Authorization")
        if token:
            if Utility.getSessionUsers(token):
                data = request.get_json()
                db_res = list(db.rooms.find({"number": data.get("roomNumber")}, {'_id': 0}))
                
                print(db_res)
                print(data)
                bookings = db_res[0]["bookings"]
                if data["date"] not in bookings:
                    bookings[data["date"]] = ["" for _ in range(18)]
                bookings[data["date"]][data["slot"]] = token
                db.rooms.update_one({"number": data.get("roomNumber")}, {"$set": {"bookings": bookings}})
                rooms = Utility.getRooms()
                print("========================")
                print()
                socketio.emit('data-change', eval(rooms.data))
                return rooms
        return [], 400


"""
    First Step of the application to login into the application.
    No User Checking At present.
    Generating Token using UUID.
    Returning it inside the authorization header in response.
""" 
class Login(Resource):
    def post(self):
        data = request.get_json()
        
        resp = Response()
        # resp.data = data
        resp.status = "201"
        resp.access_control_expose_headers = ['Authorization']
        uid = str(uuid4())
        
        resp.headers['Authorization'] = uid

        db.session.insert_one({"session_id": uid})
        
        # session.setdefault('logged_in_users', {})
        # session["logged_in_users"][uid] = True
        # print(session)
        # session.modified = True
        
        return resp
    
@socketio.on('connect')
def handle_connect():
    print('Client connected.')
    socketio.emit('message', 'Hello, World!')

api.add_resource(Home, "/")
api.add_resource(Rooms, "/getRooms")
api.add_resource(Login, "/login")
api.add_resource(BookRoom, "/bookRoom")