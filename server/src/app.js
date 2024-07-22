const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const bp = require("body-parser");
const mainRouter = require("./routes/mainRouter");
const dictionaryRouter = require("./routes/dictionaryRouter");
const userRouter = require("./routes/userRouter");
const pointRouter = require("./routes/pointRouter");
const session = require("express-session"); // 세션을 쓰기 위한 모듈 호출
const fileStore = require("session-file-store")(session);

// post 데이터 처리 등록
app.use(bp.json());

// 세션 관련 설정 정보 등록!
app.use(
  session({
    httpOnly: true, // http로 들어온 요청만 처리하겠다.
    resave: false, // 세션을 항상 재저장하겠다!
    secret: "secret", // 암호화할 때 사용하는 키 값
    store: new fileStore(), // 세션을 등록할 저장소
    saveUninitialized: false, // 세션에 저장할 내용이 없더라도 저장하겠냐?
  })
);

// 라우터 등록
app.use("/", mainRouter);
app.use("/user", userRouter);
app.use("/dictionary", dictionaryRouter);
app.use("/point", pointRouter);

// 넌적스 셋팅
app.set("view engine", "html");
nunjucks.configure("views/pages", {
  express: app,
  watch: true,
});

app.listen(3000);
