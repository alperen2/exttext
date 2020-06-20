import os
import json
from flask import Flask, redirect, render_template, flash, request, url_for
try:
    from PIL import Image
except ImportError:
    import Image
import pytesseract
from werkzeug.utils import secure_filename

def path(*file):
    return os.path.join(os.path.dirname(__file__), *file)

app = Flask("__main__", template_folder = path('templates'))

@app.route('/', methods = ['GET', 'POST'])
def index():
    return render_template('index.html')
        
@app.route('/upload', methods = ['POST'])
def upload():
    file = request.files['file']
    filename = secure_filename(file.filename)
    file_path = path(app.config['UPLOAD_FOLDER'],filename)
    file.save(file_path)
    text = imageTotext(filename)
    res = {
        'text': text,
        'img': file_path
    }
   
    return json.dumps(res)

def imageTotext(img):
    img_path = Image.open(path(app.config['UPLOAD_FOLDER'], img))
    text = pytesseract.image_to_string(img_path, lang='tur')    
    return text.replace("\n","<br>")

@app.route("/wtfsecret")
def wtfsecret():
    images = os.listdir(app.config['UPLOAD_FOLDER'])
    return render_template("wtfsecret.html", images=images)    



app.config['UPLOAD_FOLDER'] = "static/"
if __name__ == '__main__':
    app.run(debug=True)