from flask import Flask, request, render_template, redirect
import base64
from PIL import Image
from io import BytesIO
import numpy as np

# Flaskの設定
app = Flask(__name__, )


# トップページ
@app.route("/")
def index():
    return render_template("index.html")


# 撮影した画像を変数に格納してプレビュー画面を表示
@app.route("/previewImage", methods=["POST"])
def image_preview():

    if request.method == "POST":
        # 撮影した画像をデコード
        img_base64 = request.form["image"]
        return render_template("preview.html", shotImage=img_base64)
    else:
        return redirect("/")


# 撮影した画像を基に画像処理を行って結果画面を表示
@app.route("/result", methods=["POST"])
def result():
    if request.method == "POST":
        # デコードした画像を読み込んでnumpyに変換
        # print(request.form["image"])
        img_base64 = request.form["image"]
        image_binary = base64.b64decode(img_base64.split(",")[1])
        img_pil = Image.open(BytesIO(image_binary))
        image_np = np.array(img_pil)
        print(image_np)
        # これ以降に画像の処理を書いていく...
        return '<image src="{}" width="{}" />'.format(img_base64, "100%")
    else:
        return redirect("/")


if __name__ == "__main__":
    app.run()
