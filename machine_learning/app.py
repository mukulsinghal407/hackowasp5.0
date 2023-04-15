import urllib.request
import json
import requests
from flask import Flask,request 
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
# defining a route
@app.route("/", methods=['GET']) # decorator
def home(): # route handler function
    data = ""
    with urllib.request.urlopen("https://geolocation-db.com/json") as url:
        data = json.loads(url.read().decode())
    return {"latitude": data['latitude'],"longitude": data['longitude']}

@app.route("/dist", methods=['GET']) 
def distance():
    args = request.args
    latitude = args.get('latitude')
    longitude = args.get('longitude')
    lat = args.get('lat')
    lon = args.get('lon')
    url = 'https://api.distancematrix.ai/maps/api/distancematrix/json?origins='+lat+','+lon+'&destinations='+latitude+','+longitude+'&key=R6XxLsFRX27rIxU5hcXsvO63kswL3'
    response = requests.request("GET", url)
    info = response.json()
    return(info['rows'][0]['elements'])
app.run(debug = True) 

