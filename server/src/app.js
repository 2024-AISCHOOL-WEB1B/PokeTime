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
nunjucks.configure("views/pages", {
  express: app,
  watch: true,
});

app.listen(3000);
