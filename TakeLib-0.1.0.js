//名前空間
let take = {};

//キーコード名前空間
take.key = {
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
take.timer;
take.FPS;
take.WIDTH;
take.HEIGHT;

//キーボード
take.isKeyPress = new Array(250); //キーが押されているか
take.keyStatus = new Array(250); //キーが何フレーム押されているか
take.keyStatus.fill(0); //配列を0で初期化

//データ
take.images = []; //画像オブジェクト
take.audios = []; //音声オブジェクト
take.audios2 = []; //

//フラグ
take.isError = false;
take.isGameEnd = false;

//システム処理---------------------------------------------------------

//take_libraryの初期化
take.init = function (canvas_id, width, height) {
    //画面の幅と高さを設定
    take.WIDTH = width;
    take.HEIGHT = height;

    //HTML側の幅と高さを設定
    let target = document.getElementById(canvas_id)
    //target.style.width = take.WIDTH;
    //target.style.height = take.HEIGHT;
    target.setAttribute("width", take.WIDTH);
    target.setAttribute("height", take.HEIGHT);

    //マスク用canvasを生成する
    take.canvas_mask = document.createElement("canvas");
    take.canvas_mask.width = width;
    take.canvas_mask.height = height;

    //コンテキスト
    take.image_ctx = document.getElementById(canvas_id).getContext('2d'); //
    take.mask_ctx = take.canvas_mask.getContext('2d'); //絵を書く人
    //take.audio_ctx = new AudioContext(); //

    //キーを押したときのイベントハンドラ
    window.addEventListener('keydown', function (e) {
        take.isKeyPress[e.keyCode] = true;
    }, true);

    //キーを離したときのイベントハンドラ
    window.addEventListener('keyup', function (e) {
        take.isKeyPress[e.keyCode] = false;
    }, true);

    //タッチした時のイベントハンドラ

    //タッチによる画面のスクロールを止める

    //タッチを離した時のイベントハンドラ
}

//ゲーム開始処理
take.start = function (fps, main) {
    take.FPS = fps;
    
    if (isNaN(take.timer)) {
        take.timer = setInterval(function () {
            //canvasを削除する
            //take.image_ctx.clearRect(0, 0, WIDTH, HEIGHT)
            take.drawRect(0, 0, take.WIDTH, take.HEIGHT, "black");

            //キーボードの更新
            for (let i = 0; i < 250; i++) {
                if (take.isKeyPress[i]) {
                    take.keyStatus[i]++;
                } else {
                    take.keyStatus[i] = 0;
                }
            }

            main();

            //エラーが発生したら停止
            if (take.isError) {
                alert("エラーが発生しました！");
                alert("コンソールを確認してください！");
                clearInterval(take.timer);
            }

            //ゲーム終了
            if (take.isGameEnd) {
                clearInterval(take.timer);
            }
        }, Math.round(1000 / fps));
    }
    
}

//画像データ処理-------------------------------------------------------

//画像を読み込む
take.loadImage = function (name, path) {
    $.get(path).done(function () {

    }).fail(function () {
        console.log("指定した音声（" + path + "）は存在しません！");
        console.log("pathが正しいか確認してください！");
        take.images[name].status = "NG";
        take.isError = true;
    });

    take.images[name] = new Image();
    take.images[name].src = path;
    take.images[name].status = "LOADING";
    take.images[name].onload = function () {
        take.images[name].status = "OK";
    }
    take.images[name].onerror = function () {
        console.log("エラーが発生しました！");
        console.log("指定した画像（" + path + "）の拡張子がブラウザに対応しているか確認してください！");
        take.images[name].status = "NG";
        take.isError = true;
    }
}

//ロードが完了したかを確認
take.checkLoadImage = function () {
    let n = 0;

    Object.keys(take.images).forEach(function (key) {
        if (this[key].complete == true) {
            n++;
        }
    }, take.images);

    if (n == Object.keys(take.images).length) {
        return true;
    } else {
        return false;
    }

    //★エラーになる見本として残しておく↓
    /*Object.keys(take.images).forEach(function (key) {
        if (this[key].complete == false) {
            return false;
        }
    }, take.images);
    return true;*/
}

//イメージオブジェクトを取得
take.getImage = function (name) {
    if (take.images[name]) {
        return take.images[name];
    }
    console.log("指定された画像（" + name + "）は読み込まれていません！");
    take.isError = true;
}

//指定の画像を削除
take.deleteImage = function (name) {

}

//全ての画像を削除
take.clearImage = function () {
    take.images = [];
}

//音声データ処理-------------------------------------------------------

//音声を読み込む
take.loadAudio = function (name, path) {
    $.get(path).done(function () {

    }).fail(function () {
        console.log("指定した音声（" + path + "）は存在しません！");
        console.log("pathが正しいか確認してください！");
        take.audios[name].status = "NG";
        take.isError = true;
    });

    take.audios[name] = {};
    take.audios[name].buffer_num = 1;
    take.audios[name].iterator = 0;
    take.audios[name].data = [new Audio()];//音声データは配列にする
    take.audios[name].status = "LOADING";
    take.audios[name].data[0].src = path;
    take.audios[name].data[0].addEventListener('canplaythrough', function (e) {
        take.audios[name].status = "OK";
    });
    take.audios[name].data[0].addEventListener('error', function (e) {
        console.log("エラーが発生しました！");
        console.log("指定した音声（" + path + "）の拡張子がブラウザに対応している確認してください！");
        take.audios[name].status = "NG";
        take.isError = true;
    });
}

//ロードが完了したかを確認
take.checkLoadAudio = function () {
    let n = 0;

    Object.keys(take.audios).forEach(function (key) {
        if (this[key].status == "OK") {
            n++;
        }
    }, take.audios);

    if (n == Object.keys(take.audios).length) {
        return true;
    } else {
        return false;
    }
}

//オーディオオブジェクトを取得
take.getAudio = function (name) {
    let tmp = take.audios[name];
    if (tmp.data[tmp.iterator]) {
        return tmp.data[tmp.iterator];
    }
    console.log("指定された音声（" + name + "）は読み込まれていません！");
    take.isError = true;
}

//指定の音声を削除
take.deleteAudio = function (name) {

}

//全ての音声を削除
take.clearAudio = function () {
    take.audios = [];
}

//音声を再生
take.playAudio = function (name, loop) {
    let tmp = take.audios[name];

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
                tmp.data[tmp.iterator].src = tmp.data[0].src;
                tmp.data[tmp.iterator].play();
                break;
            }
        }

        tmp.data[tmp.iterator].loop = loop;
        tmp.data[tmp.iterator].play();

        return;
    }
    console.log("指定された音声（" + name + "）は読み込まれていません！");
    this.isError = true;
}

//音声を停止
take.stopAudio = function (name) {
    let tmp = take.audios[name];
    if (tmp.data[tmp.iterator]) {
        tmp.data[tmp.iterator].pause();
        return;
    }
    console.log("指定された音声（" + name + "）は読み込まれていません！");
    this.isError = true;
}

//音量を変更
take.changeVolume = function (name, volume) {
    
}

// 音声データ処理（新型）----------------------------------------------
/*take.loadAudio2 = function (name, path) {
    $.get(path).done(function () {

    }).fail(function () {
        console.log("指定した音声（" + path + "）は存在しません！");
        console.log("pathが正しいか確認して下さい！");
        take.audios2[name].status = "NG";
        take.isError = true;
    });

    take.audios2[name] = take.audio_ctx.createBufferSource();
    //take.audios2[name] = new XMLHttpRequest();
    var request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';

    request.onreadystatechange = () => {
        take.audio_ctx.decodeAudioData(request.response, (buffer) => {
            take.audios2[name].buffer = buffer;
            take.audios2[name].connect(take.audio_ctx.destination);
            //take.audios2[name].start(0);
        });
    };
    request.open('GET', path, true);
    request.send();
}

take.playAudio2 = function (name) {
    take.audios2[name].start(0);
    take.audios2[name].stop(10);

    console.log("play audio.");
}*/

//マスク処理----------------------------------------------------------

//マスクの削除
take.maskClear = function () {
    take.mask_ctx.clearRect(0, 0, canvas_mask.width, canvas_mask.height);
}

//マスク用canvasからhtml上のcanvasに描画
take.drawMaskedImage = function () {
    //htmlのcanvasのイメージデータを取得
    let canvas_Image = take.image_ctx.getImageData(0, 0, WIDTH, HEIGHT);//イメージデータオブジェクトを返す
    let canvas_RGB = canvas_Image.data;//１次元配列を返す

    //マスク用canvasのイメージデータを取得
    let mask_Image = take.mask_ctx.getImageData(0, 0, WIDTH, HEIGHT);//イメージデータオブジェクトを返す
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
take.strokeColor = function (color) {
    take.image_ctx.strokeStyle = color;
}

//塗りつぶしの色を指定するメソッド
take.fillColor = function (color) {
    take.image_ctx.fillStyle = color;
}

//フォントを指定するメソッド
take.select_font = function (str) {
    take.image_ctx.font = str;
}

//色と透明度を記憶してメソッドを実行する関数
take.keepColorAndAlpha = function (f) {
    let tmp_alpha = take.image_ctx.globalAlpha;
    let tmp_color = take.image_ctx.fillStyle;
    f();
    take.image_ctx.fillStyle = tmp_color;
    take.image_ctx.globalAlpha = tmp_alpha;
}

take.drawLine = function (x1, y1, x2, y2, color, alpha) {
    if (arguments.length == 4) {
        take.image_ctx.beginPath();
        take.image_ctx.moveTo(x1, y1);
        take.image_ctx.lineTo(x2, y2);
        take.image_ctx.closePath();
        take.image_ctx.stroke();
    } else if (arguments.length == 5) {
        take.keepColorAndAlpha(function () {
            take.image_ctx.strokeStyle = color;
            take.image_ctx.beginPath();
            take.image_ctx.moveTo(x1, y1);
            take.image_ctx.lineTo(x2, y2);
            take.image_ctx.closePath();
            take.image_ctx.stroke();
        });
    } else if (arguments.length == 6) {
        take.keepColorAndAlpha(function () {
            take.image_ctx.strokeStyle = color;
            take.image_ctx.globalAlpha = alpha;
            take.image_ctx.beginPath();
            take.image_ctx.moveTo(x1, y1);
            take.image_ctx.lineTo(x2, y2);
            take.image_ctx.closePath();
            take.image_ctx.stroke();
        });
    } else {
        console.log("drawLineの引数の数に誤りがあります！");
        take.isError() = true;
    }
}

take.drawCircle = function (x, y, r, color, alpha) {
    if (arguments.length == 3) {
        take.image_ctx.beginPath();
        take.image_ctx.arc(x, y, r, 0, Math.PI * 2, true);
        take.image_ctx.fill();
    } else if (arguments.length == 4) {
        take.keepColorAndAlpha(function () {
            take.image_ctx.fillStyle = color;
            take.image_ctx.beginPath();
            take.image_ctx.arc(x, y, r, 0, Math.PI * 2, true);
            take.image_ctx.fill();
        })
    } else if (arguments.length == 5) {
        take.keepColorAndAlpha(function () {
            take.image_ctx.fillStyle = color;
            take.image_ctx.globalAlpha = alpha;
            take.image_ctx.beginPath();
            take.image_ctx.arc(x, y, r, 0, Math.PI * 2, true);
            take.image_ctx.fill();
        });
    } else {
        console.log("drawCircleの引数の数に誤りがあります！");
        take.isError() = true;
    }
}

take.drawRect = function (x, y, w, h, color, alpha) {
    if (arguments.length == 4) {
        take.image_ctx.fillRect(x, y, w, h);
    } else if (arguments.length == 5) {
        take.keepColorAndAlpha(function () {
            take.image_ctx.fillStyle = color;
            take.image_ctx.fillRect(x, y, w, h);
        });
    } else if (arguments.length == 6) {
        take.keepColorAndAlpha(function () {
            take.image_ctx.globalAlpha = alpha;
            take.image_ctx.fillStyle = color;
            take.image_ctx.fillRect(x, y, w, h);
        });
    } else {
        console.log("drawRectの引数の数に誤りがあります！");
        take.isError() = true;
    }
}

take.drawText = function (str, x, y, color, alpha, size) {
    if (arguments.length == 3) {
        take.image_ctx.fillText(str, x, y);
    } else if (arguments.length == 4) {
        take.keepColorAndAlpha(function () {
            take.image_ctx.fillStyle = color;
            take.image_ctx.fillText(str, x, y);
        });
    } else if (arguments.length == 5) {
        take.keepColorAndAlpha(function () {
            take.image_ctx.globalAlpha = alpha;
            take.image_ctx.fillStyle = color;
            take.image_ctx.fillText(str, x, y);
        });
    } else {
        console.log("drawTextの引数の数に誤りがあります！");
        take.isError() = true;
    }
}

//画像を描画するメソッド
take.drawImage = function (name, x, y, alpha) {
    if (arguments.length == 3) {
        take.image_ctx.drawImage(take.images[name], x, y);
    } else if (arguments.length == 4) {
        take.keepColorAndAlpha(function () {
            take.image_ctx.globalAlpha = alpha;
            take.image_ctx.drawImage(take.images[name], x, y);
        });
    } else {
        console.log("drawImageの引数の数に誤りがあります！");
        take.isError() = true;
    }
}

//アニメーションに対応した画像を描画するメソッド
take.drawImageAnimation = function (name, x, y, width, height, row, column) {
    take.image_ctx.drawImage(
        take.images[name],
        width * column,
        height * row,
        width,//画像１枚あたりの幅
        height,//画像１枚あたりの高さ
        x,//実際の表示位置
        y,//実際の表示位置
        width,//表示サイズ
        height);//表示サイズ
}

//ゲージを描画するメソッド
take.drawGauge = function (x, y, width, height, ratio, edge, gauge_color) {
    //上辺
    take.drawRect(
        x - edge,
        y - edge,
        width + edge * 2,
        edge / 2,
        "#eeeeee");
    take.drawRect(
        x - edge,
        y - edge / 2,
        width + edge * 2,
        edge / 2,
        "#333333");
    //下辺
    take.drawRect(
        x - edge,
        y + height,
        width + edge * 2,
        edge / 2,
        "#eeeeee");
    take.drawRect(
        x - edge,
        y + height + edge / 2,
        width + edge * 2,
        edge / 2,
        "#333333");
    //左辺
    take.drawRect(
        x - edge,
        y,
        edge,
        height,
        "#888888");
    //右辺
    take.drawRect(
        x + width,
        y,
        edge,
        height,
        "#888888");
    //体力残量
    take.drawRect(x, y, width * ratio, height, gauge_color);
    take.drawRect(x, y + height / 2, width * ratio, height / 2, "black", 0.1);
    //ダメージ部分
    take.drawRect(x + width * ratio, y, width - width * ratio, height, "#000000");
}

/* デバッグ用 -------------------------------------------------------------------*/

take.fps = {};
take.fps.fps_now = 0;
take.fps.count = 0;
take.fps.start_time = 0;
take.fps.end_time = 1;
take.showFPS = function (x, y, color) {
    if (take.fps.count == 60) {
        take.fps.end_time = new Date();
        take.fps.fps_now = take.fps.end_time - take.fps.start_time

        take.fps.count = 0;
        take.fps.start_time = new Date();
    }
    take.drawText(String(Math.round(60 / take.fps.fps_now * 10000) / 10) + "fps", x, y, color);
    take.fps.count++;
}
