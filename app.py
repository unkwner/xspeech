from flask import Flask
from flask import render_template
from flask import request
import json
import datetime
import base64
import time
import logging
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler = logging.FileHandler("log.txt")
handler.setLevel(logging.INFO)
handler.setFormatter(formatter)
app=Flask(__name__) #创建1个Flask实例

@app.route('/')
def index():    #视图函数
    return render_template('index.html')
@app.route('/upload')
def upload():
    rec = {}
    rec["time"] = str(datetime.datetime.now())
    recv_data = request.get_data()
    if recv_data:
        json_re = json.loads(recv_data)
        try:
            byte_data_8k = base64.b64decode(json_re['data'])
            '''
            asr_from = "CMOS"
            if asr_from == "CMOS":
                url = "http://127.0.0.1:8081/asrability/online"
                client = CMOSASR(url,byte_data_8k[44:],80000)
                time.sleep(1)
                result = client.get_rec()
            '''
            rec["rec"] = 'result'
            rec["status"] = "success"
            rec["from"] = "8081"
            return json.dumps(rec)
        except Exception as e:
            rec["rec"] = "none"
            rec["status"] = "asr error"
    else:
        rec["rec"] = "none"
        rec["status"] = "receive data is empty"
    return json.dumps(rec)
