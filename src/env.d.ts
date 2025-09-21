// 型別宣告：讓 Worker 正確辨識 D1 綁定
export interface Env {
  DB: D1Database;
}

declare global {
  // 讓 global 的 Env 也有 DB
  // eslint-disable-next-line no-var
  var Env: Env;
}
