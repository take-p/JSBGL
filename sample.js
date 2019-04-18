let isDebug = true;//デバッグ中か
let scene; //シーンオブジェクト

let x = 400, y = 300;

//初期化処理
function init() {
    //ライブラリを初期化
    take.init('canvas', width=800, height=600);

    //シーンを生成
    //scene = new Caution();

    //ゲームスタート
    take.start(fps=60, function () {
        //更新
        //scene.update();

        //描画
        //scene.draw();
        
        take.select_font("italic bold 15px sans-serif");
        take.drawText("Hello, world!", 400, 300, 'RED', 1);
        take.drawCircle(x, y, 10, 'RED');
        
        if (take.keyStatus[take.key.LEFT] > 0) {
            x -= 10;
        } else if (take.keyStatus[take.key.RIGHT] > 0) {
            x += 10;
        }
        
        if (take.keyStatus[take.key.UP] > 0) {
            y -= 10;
        } else if (take.keyStatus[take.key.DOWN] > 0) {
            y += 10;
        }

        //デバッグ
        /*
        if (take.keyStatus[take.key.D] == 1) {
            isDebug = !isDebug;
        }
        if (isDebug) {
            debugMode();
        }*/
    });
}

/*
function debugMode() {
    let layers = scene.layers;

    take.select_font("italic bold 15px sans-serif");
    take.fillColor("white");

    //
    let x = 20, y = 20;
    take.drawRect(x - 10, y - 20, 300, 110, "black", 0.5);
    take.drawText(60 + " fps", x, y);
    y += 20;
    take.drawText("scene: " + scene.name, x, y);
    y += 20;
    take.drawText("event: " + scene.eventName, x, y);
    y += 20;
    take.drawText("flame: " + scene.frame, x, y);
    y += 20;
    take.drawText("bright: " + scene.bright + "%", x, y);
    y += 40;

    //各アクターの数
    take.drawRect(x - 10, y - 20, 150, Object.keys(layers).length * 20 + 10, "black", 0.5);

    Object.keys(layers).forEach(function (key) {
        take.drawText(key, x, y);
        take.drawText(":" + layers[key].length, x + 100, y);
        y += 20;
    }, layers);

    //キーボードの状態
    //for (let i = 0; i < 10; i++) {
    //    for (let j = 0; j < 25; j++) {
    //        ctx.fillText(keyStatus[i * 25 + j], 20 + 40 * i, 20 + 20 * j);
    //    }
    //}

    //リソース読み込み状況---------------------------------------------
    x = 500;
    y = 20;
    take.drawRect(x - 10, y - 20, 200, Object.keys(take.images).length * 20 + 30, "black", 0.5);

    //画像の読み込み状況
    take.drawText("画像", x, y, "white");

    Object.keys(take.images).forEach(function (key) {
        y += 20;
        if (this[key].status == "OK") {
            take.fillColor("#00ff00");
        } else if (this[key].status == "LOADING") {
            take.fillColor("#ffff00");
        } else {
            take.fillColor("#ff0000");
        }
        take.drawText(key, x, y);
        take.drawText("：" + this[key].status, x + 130, y);
    }, take.images);

    //音声の読み込み状況
    y += 40;
    take.drawRect(x - 10, y - 20, 200, Object.keys(take.audios).length * 20 + 30, "black", 0.5);
    take.drawText("音声", x, y, "white");

    Object.keys(take.audios).forEach(function (key) {
        y += 20;
        if (this[key].status == "OK") {
            take.fillColor("#00ff00");
        } else if (this[key].status == "LOADING") {
            take.fillColor("#ffff00");
        } else {
            take.fillColor("#ff0000");
        }

        take.drawText(key, x, y);
        take.drawText(this[key].data.length, x + 110, y);
        take.drawText("：" + this[key].status, x + 130, y);
    }, take.audios);

    //音声の状態
    //x = 20;
    //y = 20;
    //Object.keys(take.audios).forEach(function (key) {
    //    take.audios[key].data.forEach(function(D, i) {
    //        take.drawText("E: " + D.ended, x, y, "purple");
    //        take.drawText("P: " + D.paused, x, y + 20, "purple");
    //        x += 100;
    //    });
    //    x = 20;
    //    y += 60
    //});
}
*/