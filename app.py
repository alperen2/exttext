import os
import json
from flask import Flask, redirect, render_template, flash, request, url_for
try:
    from PIL import Image
except ImportError:
    import Image
import pytesseract
from werkzeug.utils import secure_filename

app = Flask("__main__")
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}


@app.route('/', methods = ['GET', 'POST'])
def index():
    return render_template('index.html')
        
@app.route('/upload', methods = ['POST'])
def upload():
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    text = imageTotext(filename)
    res = {
        'text': text,
        'img': os.path.join(app.config['UPLOAD_FOLDER'], filename)
    }
    return json.dumps(res)

def imageTotext(img):
    img = Image.open('static/upload/{}'.format(img))
    text = pytesseract.image_to_string(img, lang='tur')    
    return text.replace("\n","<br>")


app.config['UPLOAD_FOLDER'] = "static/upload"
if __name__ == '__main__':
    app.run(debug=True)