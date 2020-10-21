// JSBGL(Java Script Browser Game Library)
// 対応ブラウザ: Google Chrome, FireFox, Edge

// この変数からJSBGLの機能を呼び出す
let jsbgl = {};

//キーコード
jsbgl.key = {
    BACK_SPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT_LEFT: 16,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    INSERT: 45,
    DELETE: 46,
    WIN_LEFT: 47,
    NUM_0: 48,
    NUM_1: 49,
    NUM_2: 50,
    NUM_3: 51,
    NUM_4: 52,
    NUM_5: 53,
    NUM_6: 54,
    NUM_7: 55,
    NUM_8: 56,
    NUM_9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    WIN_RIGHT: 91,
    APPS: 93,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUM_LOCK: 144,
    SCROL_LOCK: 145,
    SEMI_COLON: 186,
    COLON: 187,
    COMMA: 188,
    HYPHEN: 189,
    PELIOD: 190,
    KATAKANA_HIRAGANA: 242,
    SEC_T: 243,
    HANKAKU_ZENKAKU: 244
};

//変数-------------------------------------------------------------
jsbgl.FPS; // フレームレート
jsbgl.WIDTH; // 画面の幅
jsbgl.HEIGHT; // 画面の高さ

//キーボード
jsbgl.isKeyPress = new Array(250); // キーが押されているか
jsbgl.keyStatus = new Array(250); // キーが何フレーム押されているか
jsbgl.keyStatus.fill(0); // 配列を0で初期化

//データ
jsbgl.images = []; // 画像オブジェクト
jsbgl.audios = []; // 音声オブジェクト
jsbgl.audios2 = []; // WebAudioAPI用

//フラグ
jsbgl.isError = false; // エラー発生
jsbgl.isGameEnd = false; // ゲーム終了

//システム処理---------------------------------------------------------

//jsbgl_libraryの初期化
jsbgl.init = function (canvas_id, width, height) {
    //画面の幅と高さを設定
    jsbgl.WIDTH = width;
    jsbgl.HEIGHT = height;

    //HTML側の幅と高さを設定
    let target = document.getElementById(canvas_id)
    target.setAttribute("width", jsbgl.WIDTH);
    target.setAttribute("height", jsbgl.HEIGHT);

    //マスク用canvasを生成する
    jsbgl.canvas_mask = document.createElement("canvas");
    jsbgl.canvas_mask.width = width;
    jsbgl.canvas_mask.height = height;

    //コンテキスト
    jsbgl.image_ctx = document.getElementById(canvas_id).getContext('2d'); // 絵を描く人
    jsbgl.mask_ctx = jsbgl.canvas_mask.getContext('2d'); // マスクを書く人
    //jsbgl.audio_ctx = new AudioContext(); // ???

    //キーを押したときのイベントハンドラ
    window.addEventListener('keydown', function(e) {
        jsbgl.isKeyPress[e.keyCode] = true;
    }, true);

    //キーを離したときのイベントハンドラ
    window.addEventListener('keyup', function(e) {
        jsbgl.isKeyPress[e.keyCode] = false;
    }, true);

    // クリック処理（未実装）-----------------------------
    window.addEventListener('mousedown', function(e) {

    });

    // スマホ用機能（未実装） ----------------------------------
    // smartphone (Not yet installed)-----------------------
    if (window.TouchEvent) {
        //タッチした時のイベントハンドラ
        window.addEventListener('touchstart', function(e) {

        });
        //タッチしたまま平行移動
        window.addEventListener('touchmove', function(e) {

        });
        //タッチを離した時のイベントハンドラ
        window.addEventListener('touchend', function(e) {

        });
    }
}

//ゲーム開始処理
jsbgl.start = async function(fps, main) {
    var count = 0; // 現在何フレーム目か
    var startTime = 0; // 経過時間を計る基準となる時間
    var waitTime = 0; // 待機時間
    var N = 60; // 待機時間を計算するためのサンプル数
    jsbgl.fpsNow = 0;
    while (true) {
        //canvasを黒く塗りつぶす
        jsbgl.drawRect(0, 0, jsbgl.WIDTH, jsbgl.HEIGHT, "black");

        // キーボードの更新
        for (let i = 0; i < 250; i++) {
            if (jsbgl.isKeyPress[i]) {
                jsbgl.keyStatus[i]++;
            } else {
                jsbgl.keyStatus[i] = 0;
            }
        }

        // フレームレート計算
        if (count == 0) {
            startTime = performance.now();
        } else if (count == N) {
            var endTime = performance.now()
            jsbgl.fpsNow = 1000 / ((endTime - startTime) / N);
            count = 0;
            startTime = endTime;
        }
        count++;

        // 更新と描画
        main();

        // 待機時間を計算
        var tookTime = performance.now() - startTime;
        var waitTime = count * 1000 / fps - tookTime;
        // 待機
        if (waitTime > 0) {
            const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await _sleep(waitTime);
        }

        // ゲーム終了
        if (jsbgl.isGameEnd) {
            break;
        }

        // エラー発生
        if (jsbgl.isError) {
            alert("エラーが発生しました！");
            alert("コンソールを確認してください！");
            clearInterval(jsbgl.timer);
            jsbgl.isGameEnd = true;
        }
    }
};

//画像データ処理-------------------------------------------------------

//画像を読み込む
jsbgl.loadImage = function (name, path) {
    $.get(path).done(function () {

    }).fail(function () {
        console.log("指定した音声（" + path + "）は存在しません！");
        console.log("pathが正しいか確認してください！");
        jsbgl.images[name].status = "ERROR";
        jsbgl.isError = true;
    });

    jsbgl.images[name] = new Image();
    jsbgl.images[name].src = path;
    jsbgl.images[name].status = "LOADING";
    jsbgl.images[name].onload = function () {
        jsbgl.images[name].status = "OK";
    }
    jsbgl.images[name].onerror = function () {
        console.log("エラーが発生しました！");
        console.log("指定した画像（" + path + "）の拡張子がブラウザに対応しているか確認してください！");
        jsbgl.images[name].status = "ERROR";
        jsbgl.isError = true;
    }
}

//ロードが完了したかを確認
jsbgl.checkLoadImage = function () {
    let n = 0;

    Object.keys(jsbgl.images).forEach(function (key) {
        if (this[key].complete == true) {
            n++;
        }
    }, jsbgl.images);

    if (n == Object.keys(jsbgl.images).length) {
        return true;
    } else {
        return false;
    }
}

//イメージオブジェクトを取得
jsbgl.getImage = function (name) {
    if (jsbgl.images[name]) {
        return jsbgl.images[name];
    }
    console.log("指定された画像（" + name + "）は読み込まれていません！");
    jsbgl.isError = true;
}

//指定の画像を削除
jsbgl.deleteImage = function (name) {

}

//全ての画像を削除
jsbgl.clearImage = function () {
    jsbgl.images = [];
}

//音声データ処理-------------------------------------------------------

//音声を読み込む
jsbgl.loadAudio = function (name, path) {
    $.get(path).done(function () {

    }).fail(function () {
        console.log("指定した音声（" + path + "）は存在しません！");
        console.log("pathが正しいか確認してください！");
        jsbgl.audios[name].status = "ERROR";
        jsbgl.isError = true;
    });

    jsbgl.audios[name] = {};
    jsbgl.audios[name].buffer_num = 1;
    jsbgl.audios[name].iterator = 0;
    jsbgl.audios[name].data = [new Audio()];//音声データは配列にする
    jsbgl.audios[name].status = "LOADING";
    jsbgl.audios[name].data[0].src = path;
    jsbgl.audios[name].data[0].addEventListener('canplaythrough', function (e) {
        jsbgl.audios[name].status = "OK";
    });
    jsbgl.audios[name].data[0].addEventListener('error', function (e) {
        console.log("エラーが発生しました！");
        console.log("指定した音声（" + path + "）の拡張子がブラウザに対応している確認してください！");
        jsbgl.audios[name].status = "ERROR";
        jsbgl.isError = true;
    });
}

//ロードが完了したかを確認
jsbgl.checkLoadAudio = function () {
    let n = 0;

    Object.keys(jsbgl.audios).forEach(function (key) {
        if (this[key].status == "OK") {
            n++;
        }
    }, jsbgl.audios);

    if (n == Object.keys(jsbgl.audios).length) {
        return true;
    } else {
        return false;
    }
}

//オーディオオブジェクトを取得
jsbgl.getAudio = function (name) {
    let tmp = jsbgl.audios[name];
    if (tmp.data[tmp.iterator]) {
        return tmp.data[tmp.iterator];
    }
    console.log("指定された音声（" + name + "）は読み込まれていません！");
    jsbgl.isError = true;
}

//指定の音声を削除
jsbgl.deleteAudio = function (name) {

}

//全ての音声を削除
jsbgl.clearAudio = function () {
    jsbgl.audios = [];
}

//音声を再生
jsbgl.playAudio = function (name, isLoop) {
    let tmp = jsbgl.audios[name];

    //指定した音声が存在する場合
    if (tmp.data[tmp.iterator]) {
        let start = tmp.iterator;

        //現在指し示している音声が再生中であればイテレータを進める
        while (tmp.data[tmp.iterator].paused == false) {
            tmp.iterator++;

            //イテレータが配列の範囲を超えた場合は0に戻す
            if (tmp.iterator >= tmp.data.length) {
                tmp.iterator = 0;
            }

            //全ての音声が再生中ならバッファーを増やす
            if (tmp.iterator == start) {
                tmp.data.push(new Audio());
                tmp.iterator = tmp.data.length - 1;
                tmp.data[tmp.iterator].src = tmp.data[0].src; // 音声のソース元パスをコピー
                tmp.data[tmp.iterator].volume = tmp.data[0].volume; // 音量もコピー
                tmp.data[tmp.iterator].play();
                return;
                break;
            }
        }

        tmp.data[tmp.iterator].loop = isLoop;
        tmp.data[tmp.iterator].play();

        return;
    }
    console.log("指定された音声（" + name + "）は読み込まれていません！");
    this.isError = true;
}

//音声を停止
jsbgl.stopAudio = function (name) {
    let tmp = jsbgl.audios[name];
    if (tmp.data[tmp.iterator]) {
        tmp.data[tmp.iterator].pause();
        return;
    }
    console.log("指定された音声（" + name + "）は読み込まれていません！");
    this.isError = true;
}

// 音量を変更
jsbgl.changeVolume = function (name, volume) {
    let tmp = jsbgl.audios[name];

    //指定した音声が存在する場合
    if (tmp.data[tmp.iterator]) {
        for (const elem of tmp.data) {
            elem.volume = volume;
        }
        return;
    }
    console.log("指定された音声（" + name + "）は読み込まれていません！");
    this.isError = true;
}

// 音声データ処理（Web Audio API version）----------------------------------------------
/*jsbgl.loadAudio2 = function (name, path) {
    $.get(path).done(function () {

    }).fail(function () {
        console.log("指定した音声（" + path + "）は存在しません！");
        console.log("pathが正しいか確認して下さい！");
        jsbgl.audios2[name].status = "NG";
        jsbgl.isError = true;
    });

    jsbgl.audios2[name] = jsbgl.audio_ctx.createBufferSource();
    //jsbgl.audios2[name] = new XMLHttpRequest();
    var request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';

    request.onreadystatechange = () => {
        jsbgl.audio_ctx.decodeAudioData(request.response, (buffer) => {
            jsbgl.audios2[name].buffer = buffer;
            jsbgl.audios2[name].connect(jsbgl.audio_ctx.destination);
            //jsbgl.audios2[name].start(0);
        });
    };
    request.open('GET', path, true);
    request.send();
}

jsbgl.playAudio2 = function (name) {
    jsbgl.audios2[name].start(0);
    jsbgl.audios2[name].stop(10);

    console.log("play audio.");
}*/

//マスク処理----------------------------------------------------------

//マスクの削除
jsbgl.maskClear = function () {
    jsbgl.mask_ctx.clearRect(0, 0, canvas_mask.width, canvas_mask.height);
}

//マスク用canvasからhtml上のcanvasに描画
jsbgl.drawMaskedImage = function () {
    //htmlのcanvasのイメージデータを取得
    let canvas_Image = jsbgl.image_ctx.getImageData(0, 0, WIDTH, HEIGHT);//イメージデータオブジェクトを返す
    let canvas_RGB = canvas_Image.data;//１次元配列を返す

    //マスク用canvasのイメージデータを取得
    let mask_Image = jsbgl.mask_ctx.getImageData(0, 0, WIDTH, HEIGHT);//イメージデータオブジェクトを返す
    let mask_RGB = mask_Image.data;//１次元配列を返す

    //書き込む
    for (let i = 0, len = WIDTH * HEIGHT; i < len; i++) {
        //ピクセル
        let p = i * 4;

        if (mask_RGB[p + 3] != 0) {
            //RGB値
            canvas_RGB[p] = mask_RGB[p];
            canvas_RGB[p + 1] = mask_RGB[p + 1];
            canvas_RGB[p + 2] = mask_RGB[p + 2];
        }
    }
    //htmlのcanvasに書き込む
    ctx.putImageData(canvas_Image, 0, 0);
}

//図形描画処理---------------------------------------------------------

//線の色を指定するメソッド
jsbgl.strokeColor = function (color) {
    jsbgl.image_ctx.strokeStyle = color;
}

//塗りつぶしの色を指定するメソッド
jsbgl.fillColor = function (color) {
    jsbgl.image_ctx.fillStyle = color;
}

//フォントを指定するメソッド
jsbgl.select_font = function (str) {
    jsbgl.image_ctx.font = str;
}

// 色と透明度を記憶してメソッドを実行する関数
jsbgl.keepColorAndAlpha = function (f) {
    let tmp_alpha = jsbgl.image_ctx.globalAlpha;
    let tmp_color = jsbgl.image_ctx.fillStyle;
    f();
    jsbgl.image_ctx.fillStyle = tmp_color;
    jsbgl.image_ctx.globalAlpha = tmp_alpha;
}

// 線を描画
jsbgl.drawLine = function (x1, y1, x2, y2, color, alpha) {
    if (arguments.length == 4) {
        jsbgl.image_ctx.beginPath();
        jsbgl.image_ctx.moveTo(x1, y1);
        jsbgl.image_ctx.lineTo(x2, y2);
        jsbgl.image_ctx.closePath();
        jsbgl.image_ctx.stroke();
    } else if (arguments.length == 5) {
        jsbgl.keepColorAndAlpha(function () {
            jsbgl.image_ctx.strokeStyle = color;
            jsbgl.image_ctx.beginPath();
            jsbgl.image_ctx.moveTo(x1, y1);
            jsbgl.image_ctx.lineTo(x2, y2);
            jsbgl.image_ctx.closePath();
            jsbgl.image_ctx.stroke();
        });
    } else if (arguments.length == 6) {
        jsbgl.keepColorAndAlpha(function () {
            jsbgl.image_ctx.strokeStyle = color;
            jsbgl.image_ctx.globalAlpha = alpha;
            jsbgl.image_ctx.beginPath();
            jsbgl.image_ctx.moveTo(x1, y1);
            jsbgl.image_ctx.lineTo(x2, y2);
            jsbgl.image_ctx.closePath();
            jsbgl.image_ctx.stroke();
        });
    } else {
        console.log("drawLineの引数の数に誤りがあります！");
        jsbgl.isError() = true;
    }
}

// 円を描画
jsbgl.drawCircle = function (x, y, r, color, alpha) {
    if (arguments.length == 3) {
        jsbgl.image_ctx.beginPath();
        jsbgl.image_ctx.arc(x, y, r, 0, Math.PI * 2, true);
        jsbgl.image_ctx.fill();
    } else if (arguments.length == 4) {
        jsbgl.keepColorAndAlpha(function () {
            jsbgl.image_ctx.fillStyle = color;
            jsbgl.image_ctx.beginPath();
            jsbgl.image_ctx.arc(x, y, r, 0, Math.PI * 2, true);
            jsbgl.image_ctx.fill();
        })
    } else if (arguments.length == 5) {
        jsbgl.keepColorAndAlpha(function () {
            jsbgl.image_ctx.fillStyle = color;
            jsbgl.image_ctx.globalAlpha = alpha;
            jsbgl.image_ctx.beginPath();
            jsbgl.image_ctx.arc(x, y, r, 0, Math.PI * 2, true);
            jsbgl.image_ctx.fill();
        });
    } else {
        console.log("drawCircleの引数の数に誤りがあります！");
        jsbgl.isError() = true;
    }
}

// 資格を描画
jsbgl.drawRect = function (x, y, w, h, color, alpha) {
    if (arguments.length == 4) {
        jsbgl.image_ctx.fillRect(x, y, w, h);
    } else if (arguments.length == 5) {
        jsbgl.keepColorAndAlpha(function () {
            jsbgl.image_ctx.fillStyle = color;
            jsbgl.image_ctx.fillRect(x, y, w, h);
        });
    } else if (arguments.length == 6) {
        jsbgl.keepColorAndAlpha(function () {
            jsbgl.image_ctx.globalAlpha = alpha;
            jsbgl.image_ctx.fillStyle = color;
            jsbgl.image_ctx.fillRect(x, y, w, h);
        });
    } else {
        console.log("drawRectの引数の数に誤りがあります！");
        jsbgl.isError() = true;
    }
}

jsbgl.drawText = function (str, x, y, color, alpha, size) {
    if (arguments.length == 3) {
        jsbgl.image_ctx.fillText(str, x, y);
    } else if (arguments.length == 4) {
        jsbgl.keepColorAndAlpha(function () {
            jsbgl.image_ctx.fillStyle = color;
            jsbgl.image_ctx.fillText(str, x, y);
        });
    } else if (arguments.length == 5) {
        jsbgl.keepColorAndAlpha(function () {
            jsbgl.image_ctx.globalAlpha = alpha;
            jsbgl.image_ctx.fillStyle = color;
            jsbgl.image_ctx.fillText(str, x, y);
        });
    } else {
        console.log("drawTextの引数の数に誤りがあります！");
        jsbgl.isError() = true;
    }
}

//画像を描画するメソッド
jsbgl.drawImage = function (name, x, y, alpha) {
    if (arguments.length == 3) {
        jsbgl.image_ctx.drawImage(jsbgl.images[name], x, y);
    } else if (arguments.length == 4) {
        jsbgl.keepColorAndAlpha(function () {
            jsbgl.image_ctx.globalAlpha = alpha;
            jsbgl.image_ctx.drawImage(jsbgl.images[name], x, y);
        });
    } else {
        console.log("drawImageの引数の数に誤りがあります！");
        jsbgl.isError() = true;
    }
}

//アニメーションに対応した画像を描画するメソッド
jsbgl.drawImageAnimation = function (name, x, y, width, height, row, column) {
    jsbgl.image_ctx.drawImage(
        jsbgl.images[name],
        (width + 1) * column,
        (height + 1) * row,
        width,//画像１枚あたりの幅
        height,//画像１枚あたりの高さ
        x,//実際の表示位置
        y,//実際の表示位置
        width,//表示サイズ
        height);//表示サイズ
}

//ゲージを描画するメソッド
jsbgl.drawGauge = function (x, y, width, height, ratio, edge, gauge_color) {
    //上辺
    jsbgl.drawRect(
        x - edge,
        y - edge,
        width + edge * 2,
        edge / 2,
        "#eeeeee");
    jsbgl.drawRect(
        x - edge,
        y - edge / 2,
        width + edge * 2,
        edge / 2,
        "#333333");
    //下辺
    jsbgl.drawRect(
        x - edge,
        y + height,
        width + edge * 2,
        edge / 2,
        "#eeeeee");
    jsbgl.drawRect(
        x - edge,
        y + height + edge / 2,
        width + edge * 2,
        edge / 2,
        "#333333");
    //左辺
    jsbgl.drawRect(
        x - edge,
        y,
        edge,
        height,
        "#888888");
    //右辺
    jsbgl.drawRect(
        x + width,
        y,
        edge,
        height,
        "#888888");
    //体力残量
    jsbgl.drawRect(x, y, width * ratio, height, gauge_color);
    jsbgl.drawRect(x, y + height / 2, width * ratio, height / 2, "black", 0.1);
    //ダメージ部分
    jsbgl.drawRect(x + width * ratio, y, width - width * ratio, height, "#000000");
}

/* デバッグ用 -------------------------------------------------------------------*/

// 現在のフレームレートを取得
jsbgl.showFPS = function (x, y, color) {
    jsbgl.drawText(String(Math.round(jsbgl.fpsNow)) + " fps", x, y, color);
}