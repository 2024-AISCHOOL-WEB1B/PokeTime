const express = require("express");
const path = require("path");
const app = express();
const nunjucks = require("nunjucks");
const bp = require("body-parser");
const session = require("express-session");
const fileStore = require("session-file-store")(session);

// 정적 파일 제공 설정(css)
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path, stat) => {
      if (path.endsWith(".css")) {
        res.set("Content-Type", "text/css");
      }
      if (path.endsWith(".svg")) {
        res.set("Content-Type", "image/svg+xml");
      }
    },
  })
);

// post 데이터 처리 등록
app.use(bp.json());

// 세션 설정 (한 번만 설정)
app.use(
  session({
    httpOnly: true,
    resave: false,
    secret: "secret",
    store: new fileStore(),
    saveUninitialized: true, // 세션 초기화 시 저장
  })
);

// 라우터 등록
const mainRouter = require("./routes/mainRouter");
const dictionaryRouter = require("./routes/dictionaryRouter");
const userRouter = require("./routes/userRouter");
const pointRouter = require("./routes/pointRouter");

app.use("/", mainRouter);
app.use("/user", userRouter);
app.use("/dictionary", dictionaryRouter);
app.use("/point", pointRouter);

// 넌적스 설정
app.set("view engine", "html");
const env = nunjucks.configure("views/pages", {
  express: app,
  watch: true,
});

// 날짜 차이 계산 함수
function dateDiffInDays(date1, date2) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// 커스텀 필터 등록
env.addFilter("daysSince", function (dateString) {
  if (typeof dateString !== "string") {
    dateString = dateString.toString();
  }
  const today = new Date();
  const withDate = new Date(
    dateString.substring(0, 4),
    dateString.substring(4, 6) - 1,
    dateString.substring(6, 8)
  );
  return dateDiffInDays(withDate, today);
});

app.listen(3000);
