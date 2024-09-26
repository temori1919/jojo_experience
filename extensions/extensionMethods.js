/**
 * 現在日付から設定済みのテーマファイル名を取得する
 * @returns
 */
const resolveDate = async () => {
  const confiig = await import("./config.js");
  const today = new Date();

  const match = confiig.seasons.find((season) => {
    const from = new Date(season.from);
    const to = new Date(season.to);

    return today >= from && today <= to;
  });

  return match?.file || false;
};

/**
 * 拡張テーマのrenderを実行
 * @returns
 */
const matchMedhods = async () => {
  const matchFile = await resolveDate();

  if (matchFile) {
    const method = await import(`./apps/${matchFile}.js`);
    return method.render();
  } else {
    return false;
  }
};
