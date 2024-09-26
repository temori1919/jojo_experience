// 拡張テーマの読み込み
document.onready = async () => {
  await matchMedhods();
};

document.onkeydown = (e) => {
  const current = document.activeElement;

  if (e.key === "Backspace") {
    return true;
  }
  if (
    current.type === "textarea" ||
    current.type === "text" ||
    current.type === "search"
  ) {
    (async () => {
      // タイピング時間の記録
      let {type_time} = await getStorage('type_time');
      // タイピング数のカウント
      let {type_count} = await getStorage('type_count');


      // タイピングの感覚が500ミリ秒以下ならタイピング数をカウントする
      if (
        type_time !== undefined &&
        type_count !== undefined &&
        new Date().getTime() - type_time < 500
      ) {
        setStorage({type_count: parseInt(type_count) + 1});

      } else {
        setStorage({type_count: 1});
      }

      setStorage({type_time: new Date().getTime()});

      const isEnter = e.key === "Enter";
      // キャレットの位置の取得
      const caretPosition = Measurement.caretPos(current);

      let prefix = isEnter ? "ora2" : "ora";

      // オラ
      let image = await appnedCss(
        "images/" + prefix + ".png",
        isEnter ? rand(80, 100) : rand(10, 20),
        caretPosition.top + rand(-10, 10),
        caretPosition.left + rand(-10, 10)
      );
      image = await animateRemove(image, isEnter, caretPosition);

      // タイプカウントの回数が30以上でエンターをタイプしたらセリフと効果音を表示
      if (isEnter && type_count > 30) {
        setStorage({type_count: 1});

        // 時
        image = await appnedCss(
          "images/toki.png",
          rand(80, 100),
          caretPosition.top,
          caretPosition.left,
          400
        );
        image = await animateRemove(image, isEnter, caretPosition, 200);

        // エフェクト
        image = await appnedCss(
          "images/effect" + rand(1, 4) + ".png",
          rand(80, 100),
          caretPosition.top,
          caretPosition.left,
          600
        );
        await animateRemove(image, isEnter, caretPosition);
      }
    })();
  }
};

/**
 * 乱数生成
 *
 * @param min
 * @param max
 * @returns {number}
 */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * imgをappend
 *
 * @param imgUrl
 * @param size
 * @param top
 * @param left
 * @param delay
 * @returns {Promise<any>}
 */
function appnedCss(imgUrl, size, top, left, delay) {
  const chromeInstance = chrome;

  return new Promise((resolve) => {
    delay = delay === undefined ? 0 : delay;
    setTimeout(() => {
      imgUrl = chrome.runtime.getURL(imgUrl);
      img = $(`<img width="${size}">`);
      img.attr("src", imgUrl);
      img.css({
        position: "absolute",
        top: top,
        left: left,
        zIndex: 100000,
      });
      $("body").append(img);
      resolve(img);
    }, delay);
  });
}

/**
 * imgのアニメーションと削除
 *
 * @param img
 * @param isEnter
 * @param positon
 * @param delay
 * @returns {Promise<any>}
 */
function animateRemove(img, isEnter, positon, delay) {
  return new Promise((resolve) => {
    delay = delay === undefined ? 0 : delay;
    setTimeout(() => {
      const size = isEnter ? rand(80, 100) : rand(10, 20);
      img.animate(
        {
          top: positon.top + rand(-40, 40),
          left: positon.left + rand(-40, 40),
          width: size + (isEnter ? rand(30, 50) : rand(10, 20)),
          opacity: 0,
        },
        1000,
        () => {
          img.remove();
        }
      );
      resolve(null);
    }, delay);
  });
}

function setStorage(item) {
  chrome.storage.local.set(item)
}

function getStorage(key) {
  return chrome.storage.local.get(key)
}
