let isDebug = true;//デバッグ中か
let scene; //シーンオブジェクト

let x = 400, y = 300;
let v_x = 0, v_y = 0;
let r = 10;
let mu = 0.5; // 反発係数

let g = 9.8; //重力加速度
let fps = 60; //フレームレート
let m = 0.1; // 質量

let scale = 0.01; //スケール

let d_x = 0; // 移動距離

//初期化処理
function init() {
    //ライブラリを初期化
    jsgl.init('canvas', width=800, height=600);

    //シーンを生成
    //scene = new Caution();

    //ゲームスタート
    jsgl.start(fps=60, function () {

        //空を描画
        jsgl.drawRect(0, 0, 800, 600, "#ccccff");

        //人を描画
        jsgl.drawCircle(40, 450, 10, "#000000");
        jsgl.drawRect(20, 460, 40, 140, "#000000");

        //ビルを描画
        jsgl.drawRect(100, 600, 40, -100, "#000000");

        //更新
        //scene.update();

        //描画
        //scene.draw();

        jsgl.select_font("italic bold 15px sans-serif");
        
        //fpsを表示
        jsgl.showFPS(20, 20, 'RED');

        //----------------------------------------------------------------------------------------------------------------

        //高度
        let altitude= scale * (-1 * y + 600 - r);
        //速さ
        let velocity = Math.sqrt(v_x * v_x + v_y * v_y);

        //エネルギー計算---------------------------------------------------------------------------------------------------

        //運動エネルギー
        let K = Math.round(1 / 2 * m * velocity * velocity);
        //位置エネルギー
        let U = Math.round((-1 * y + 600 - r)* scale * g * m);
        //力学的エネルギー
        let E = K + U;

        //v_x = 40 / 3.600;

        let status = {
            altitude: "高度" + Math.floor(altitude) + "[m]",
            altitude2: "高度" + Math.floor(altitude / 1000) + "[km]",
            velocity: "速度" + Math.floor(velocity) + "[m/s]",
            velocity2: "速度" + Math.floor(velocity * 3.6) + "[km/h]",
            space1: "",
            K: "運動エネルギー" + K + "[J]",
            U: "位置エネルギー" + U + "[J]",
            E: "力学的エネルギー" + E + "[J]",
            space2: "",
            v_x: "x軸方向の速さ" + Math.round(v_x) + "m/s",
            v_y: "落下速度" + Math.round(v_y) + "m/s",
            d_x: "移動距離" + Math.floor(d_x / 100) / 10 + "[km]",
            d_x2: "移動距離" + Math.round(d_x) + "[m]",
            space3: "",
            gravity: "重力加速度" + g + "m/s^2",
            mu: "反発係数" + mu,
            m: "質量" + m + "[kg]",
        };

        Object.keys(status).forEach(function(key, i) {
            //console.log(i);
            jsgl.drawText(this[key], 20, 60 + i * 20, 'RED');
        }, status);

        //ボールを表示
        jsgl.drawCircle(x, y, r, 'RED');
        
        // キー入力
        if (jsgl.keyStatus[jsgl.key.LEFT] > 0) {
            v_x -= 100 * scale;
        } else if (jsgl.keyStatus[jsgl.key.RIGHT] > 0) {
            v_x += 100 * scale;
        }
        
        if (jsgl.keyStatus[jsgl.key.UP] > 0) {
            v_y -= 200 * scale;
        } else if (jsgl.keyStatus[jsgl.key.DOWN] > 0) {
            v_y += 100 * scale;
        }

        x += (1 / scale) * v_x / fps;
        y += (1 / scale) * v_y / fps;
        d_x += v_x / fps;
        
        // 壁との反射
        if (x < 0 + r) {
            v_x *= -mu;
            x = 0 + r;
        } else if(800 - r  < x) {
            v_x *= -mu;
            x = 800 - r;
        }

        // ループ
        /*if (x < 0 - r) {
            x = 800 + r;
        } else if (800 + r < x) {
            x = 0 - r;
        }*/

        // 床との反射
        if (y < 0 + r) {
            v_x *= 0.99;
            v_y *= -mu;
            
            y = 0 + r;
        } else if(600 - r < y) {
            v_x *= 0.99;
            v_y *= -mu;
            
            y = 600 - r;
        }
        v_y += g / fps; // 重力加速
        

        //デバッグ
        /*
        if (jsgl.keyStatus[jsgl.key.D] == 1) {
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

    jsgl.select_font("italic bold 15px sans-serif");
    jsgl.fillColor("white");

    //
    let x = 20, y = 20;
    jsgl.drawRect(x - 10, y - 20, 300, 110, "black", 0.5);
    jsgl.drawText(60 + " fps", x, y);
    y += 20;
    jsgl.drawText("scene: " + scene.name, x, y);
    y += 20;
    jsgl.drawText("event: " + scene.eventName, x, y);
    y += 20;
    jsgl.drawText("flame: " + scene.frame, x, y);
    y += 20;
    jsgl.drawText("bright: " + scene.bright + "%", x, y);
    y += 40;

    //各アクターの数
    jsgl.drawRect(x - 10, y - 20, 150, Object.keys(layers).length * 20 + 10, "black", 0.5);

    Object.keys(layers).forEach(function (key) {
        jsgl.drawText(key, x, y);
        jsgl.drawText(":" + layers[key].length, x + 100, y);
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
    jsgl.drawRect(x - 10, y - 20, 200, Object.keys(jsgl.images).length * 20 + 30, "black", 0.5);

    //画像の読み込み状況
    jsgl.drawText("画像", x, y, "white");

    Object.keys(jsgl.images).forEach(function (key) {
        y += 20;
        if (this[key].status == "OK") {
            jsgl.fillColor("#00ff00");
        } else if (this[key].status == "LOADING") {
            jsgl.fillColor("#ffff00");
        } else {
            jsgl.fillColor("#ff0000");
        }
        jsgl.drawText(key, x, y);
        jsgl.drawText("：" + this[key].status, x + 130, y);
    }, jsgl.images);

    //音声の読み込み状況
    y += 40;
    jsgl.drawRect(x - 10, y - 20, 200, Object.keys(jsgl.audios).length * 20 + 30, "black", 0.5);
    jsgl.drawText("音声", x, y, "white");

    Object.keys(jsgl.audios).forEach(function (key) {
        y += 20;
        if (this[key].status == "OK") {
            jsgl.fillColor("#00ff00");
        } else if (this[key].status == "LOADING") {
            jsgl.fillColor("#ffff00");
        } else {
            jsgl.fillColor("#ff0000");
        }

        jsgl.drawText(key, x, y);
        jsgl.drawText(this[key].data.length, x + 110, y);
        jsgl.drawText("：" + this[key].status, x + 130, y);
    }, jsgl.audios);

    //音声の状態
    //x = 20;
    //y = 20;
    //Object.keys(jsgl.audios).forEach(function (key) {
    //    jsgl.audios[key].data.forEach(function(D, i) {
    //        jsgl.drawText("E: " + D.ended, x, y, "purple");
    //        jsgl.drawText("P: " + D.paused, x, y + 20, "purple");
    //        x += 100;
    //    });
    //    x = 20;
    //    y += 60
    //});
}
*/
