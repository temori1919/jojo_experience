/**
 * 拡張テーマ関数は必ずrenderという命名にすること
 */
export const render = () => {
  const tags = `
    <svg id="svg-out-jojo" width="100%" height="100vh">
      <radialGradient id="tama" cx="60%" cy="40%" r="80%">
      <stop offset="0" style="stop-color:#fff"/>
      <stop offset="0.5" style="stop-color:#eee"/>
      </radialGradient>

      <symbol id="jojo-symbol">
      <circle cx="30%" cy="10%" r="10" fill="url(#tama)"/>
      </symbol>

      <use id="snow" href="#jojo-symbol"/>
    </svg>
  `;

  $("body").prepend(tags);

  $("#svg-out-jojo").css({
    display: "block",
    position: "fixed",
    overflow: "visible",
    "z-index": 1000000,
    "pointer-events": "none",
  });

  $("#snow").css({
    animation: "snow 4s linear forwards",
    filter: "blur(3px)",
  });

  $.keyframe.define([
    {
      name: "snow",
      from: { transform: "translateY(-20vh)" },
      to: { transform: "translateY(120vh)" },
    },
  ]);

  const svgOutJojo = $("#svg-out-jojo");
  const snow = $("#snow");

  let count = 0;

  const reproduction = () => {
    let clone = snow.clone(true);
    clone.on("animationend", function () {
      clone.remove();
    });
    let iti = String(Math.random() * 200 - 100) + "%";
    clone.attr("x", iti);
    svgOutJojo.append(clone);
    count++;
  };

  setInterval(function () {
    reproduction();
  }, 150);
};
