/**
 * クライアントのカメラで撮影する関数
 * shutter_buttonを押すと撮影し、up_load_buttonで決定
 * @param  {String} videoId           カメラが映し出す映像を表示する<video>タグのid
 * @param  {String} canvasId          撮影した結果を表示する<canvas>タグのid
 * @param  {String} shutterButtonId   撮影を開始するボタンのid
 * @param  {String} formImageId       撮影した画像を送信するform要素
 * @return {void}
 */

function controlCamera(videoId, canvasId, shutterButtonId, formImageId) {
  window.onload = () => {
    const video = document.getElementById(videoId);
    const canvas = document.getElementById(canvasId);
    const formImage = document.getElementById(formImageId);

    // カメラの設定
    const constraints = {
      audio: false,
      video: {
        width: 800, // カメラの解像度を設定
        height: 600,
        facingMode: "user", // フロントカメラを利用
        // facingMode: {exact: "environment"}, //リアカメラを利用
      },
    };

    // カメラを<video>と同期
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
        };
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });

    // 撮影ボタンが押されたときのイベント処理（<video>の1フレームを<canvas>に表示）
    document.getElementById(shutterButtonId).addEventListener("click", () => {
      const canvasContext = canvas.getContext("2d");
      const rate = 0.25
      const videoW = video.offsetWidth;
      const videoH = video.offsetHeight;
      const canvasW = videoW*rate;
      const canvasH = videoH*rate;
      canvas.setAttribute("width", canvasW.toString());
      canvas.setAttribute("height", canvasH.toString());
      canvasContext.drawImage(video, 0, 0, videoW, videoH, 0, 0, canvasW, canvasH)
      canvasContext.drawImage(video);
      formImage.value = canvas.toDataURL("image/png");
    });
  };
}
