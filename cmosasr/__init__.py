#coding:utf-8
"""
Author  : yangzhengzhe
Email   : yangzhengzhe@163.com
Date    : 20190905
Version : v1.0
Notes   : 1\ This program requires a [python3] environment.
"""

from urllib.request import urlopen
from urllib.parse import quote
import json
import base64
import time
import os
import glob

#url = "http://192.168.98.215:8080/asrability/online"

def log(head,body):
    head = "\033[1;34;40m{}\033[0m".format(head)
    print(head,body)

class CMOSASR:
    
    def __init__(self,url,audio_path,length,display=False):
        #参数设置
        self.__url__          = url
        self.__sid__          = ""
        self.__syncid__       = 0 
        self.__rec__          = ""
        self.__rec_realtime__ = ""
        self.__audio_path__   = audio_path
        self.__length__       = int(length)
        self.__display__      = display
        #调用流程
        self.__ssb__()
        self.__auw__()
        self.__grs__()
        self.__sse__()

    #获取sid
    def get_sid(self):
        return self.__sid__

    #获取识别结果
    def get_rec(self):
        return self.__rec__

    #发送ssb
    def __ssb__(self):
        data = {}
        data['jsonrpc']        = "2.0"
        data['method']         = "deal_request"
        data['params']         = {}
        data['params']['cmd']  = 'ssb'
        data['params']['type'] = '1'
        data['params']['auf']  = 'audio/L16;rate=8000'
        data['params']['aue']  = 'raw'
        data['id']             = 1
        result       = self.__submit__(data)
        self.__sid__ = result['result']['sid']
        #log("ssb:",result)
        return result
    
    #发送auw
    def __auw__(self):
        '''
        with open(self.__audio_path__, 'rb+') as f:
            wav_rb = f.read()
        '''
        wav_rb = self.__audio_path__
        audio_data=str(base64.b64encode(wav_rb),'utf-8')
        number_slice = int(len(audio_data)/self.__length__)+1 
        for index in range(number_slice):
            if number_slice - index == 1:
                audio_data_index = audio_data[self.__length__*index:] 
            else:
                audio_data_index = audio_data[self.__length__*index:self.__length__*(index+1)]

            self.__syncid__ = index+1
            data={}
            data['jsonrpc']               = "2.0"
            data['method']                = "deal_request"
            data['params']                = {}
            data['params']['cmd']         = 'auw'
            data['params']['type']        = '1'
            data['params']['sid']         = self.__sid__
            data['params']['audioStatus'] = 1
            data['params']['syncid']      = self.__syncid__
            data['params']['data']        = audio_data_index
            data['id']                    = 2
            result = self.__submit__(data)
            #log("auw-{}:".format(index),result)
            if self.__display__:
               time.sleep(1)
               self.__grs_realtime__()

    def __grs_realtime__(self):
        data = {}
        data['jsonrpc']          = "2.0"
        data['method']           = "deal_request"
        data['params']           = {}
        data['params']['cmd']    = 'grs'
        data['params']['sid']    = self.__sid__
        data['params']['syncid'] = self.__syncid__
        data['params']['type']   = '1'
        data['id'] = 3
        result = self.__submit__(data)
        try:
            self.__rec_realtime__ = result["result"]["result"]
            print(self.__rec_realtime__)
        except Exception as e:
            pass

    #获取识别结果
    def __grs__(self):
        data = {}
        data['jsonrpc']          = "2.0"
        data['method']           = "deal_request"
        data['params']           = {}
        data['params']['cmd']    = 'grs'
        data['params']['sid']    = self.__sid__
        data['params']['syncid'] = self.__syncid__
        data['params']['type']   = '1'
        data['id']               = 3
        result       = self.__submit__(data)
        self.__rec__ = result["result"]["result"]
        #log("grs:",result)
        return result

    #请求结束
    def __sse__(self):
        data = {}
        data['jsonrpc']        = "2.0"
        data['method']         = "deal_request"
        data['params']         = {}
        data['params']['cmd']  = 'sse'
        data['params']['sid']  = self.__sid__
        data['params']['type'] = '1'
        data['id']             = 4
        result = self.__submit__(data)
        #log("sse:",result)
        return result

    #提交数据
    def __submit__(self,data):
        data    = bytes(json.dumps(data),'utf8')
        web     = urlopen(self.__url__,data)
        rawtext = web.read()
        jsonstr = rawtext.decode('utf8')
        result  = base64.b64decode(jsonstr)
        result  = json.loads(result)
        return result

if __name__ == "__main__":
    path = "*.pcm"
    for file in glob.glob(path):
       log("name:",file)
       client = CMOSASR(url,file,1100)
       log("rec:",client.get_rec())

