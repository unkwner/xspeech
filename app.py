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

