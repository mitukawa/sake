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
    const cameraDeviceIds = getCameraDeviceID();
    console.log(cameraDeviceIds);

    // カメラの設定
    const constraints = {
      audio: false,
      video: {
        width: { min: 800, max: 1920 }, // カメラの解像度を設定
        height: { min: 600, max: 1080 },
        deviceId: cameraDeviceIds[cameraDeviceIds.length - 1],
        // facingMode: "user", // フロントカメラを利用
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
      const rate = 1.0; // 0.5は動作した
      const w = video.offsetWidth * rate;
      const h = video.offsetHeight * rate;

      canvas.setAttribute("width", w.toString());
      canvas.setAttribute("height", h.toString());
      canvasContext.drawImage(video, 0, 0, w, h);
      formImage.value = canvas.toDataURL("image/jpeg", 0.75); //0.75だと上手くいった
    });
  };
}

/**
 * クライアントで使用できるカメラのidを取得
 * 
 * @param  {void}
 * @return {array}   使用可能なカメラのidとlabelの配列(カメラが複数ある場合は取得したカメラを全て返す)
 */
function getCameraDeviceID() {
  const cameraDeviceIds = [
    /* { deviceId, label } */
  ];
  navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
    for (let len = mediaDevices.length, i = 0; i < len; i++) {
      const item = mediaDevices[i];
      // NOTE: カメラデバイスの場合、 kind プロパティには "videoinput" が入っている:
      if (item.kind === "videoinput") {
        const cameraId = item.deviceId;
        const cameraLabel = item.label;
        // NOTE: ここでデバイスID（とラベル）を適当な変数に保存しておく
        cameraDeviceIds.push({ cameraId, cameraLabel });
      }
    }
  });
  return cameraDeviceIds;
}
