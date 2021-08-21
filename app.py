from flask import Flask
from flask import render_template
from flask import request
from flask_cors import CORS , cross_origin
import json
import datetime
import base64
import time
import logging
from cmosasr import CMOSASR
import re
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler = logging.FileHandler("log.txt")
handler.setLevel(logging.INFO)
handler.setFormatter(formatter)
app=Flask(__name__) #创建1个Flask实例
CORS(app)

@app.route('/')
def index():    #视图函数
    return render_template('index.html')

@app.route('/upload', methods=['GET','POST'])
@cross_origin()
def upload():
    rec = {}
    rec["time"] = str(datetime.datetime.now())
    url = request.form.get('asr_url')
    recv_data = request.form.get('upfile_b64')
    if recv_data:
        try:
            byte_data_8k = base64.b64decode(recv_data)
            #url = "http://39.99.128.71:8080/asrability/online"
            if url == "":
                url = "http://39.99.128.71:8002/onlineasr"
            else:
                url = url.strip()
            if not re.match(r'^https?:/{2}\w.+$', url):
                rec["error"]="url 不合法"
                rec["status"]="failed"
                return json.dumps(rec)
            client = CMOSASR(url,byte_data_8k[44:],8000)
            result = client.get_rec()
            rec["rec"] = result
            rec["status"] = "success"
            return json.dumps(rec)
        except Exception as e:
            print(e.args)
            rec["error"] = "{}".format(e.args)
            rec["status"] = "failed"
    else:
        rec["rec"] = "none"
        rec["status"] = "receive data is empty"
    return json.dumps(rec)
