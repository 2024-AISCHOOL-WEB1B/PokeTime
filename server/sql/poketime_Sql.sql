show databases;

use Insa5_JSB_hacksim_4;


-- 테이블 순서는 관계를 고려하여 한 번에 실행해도 에러가 발생하지 않게 정렬되었습니다.

-- Poke_info Table Create SQL
-- 테이블 생성 SQL - Poke_info
CREATE TABLE Poke_info
(
    `Poke_num`    INT             NOT NULL    COMMENT '포켓몬번호', 
    `Poke_name`   VARCHAR(20)     NOT NULL    COMMENT '포켓몬이름', 
    `Poke_type`   VARCHAR(20)     NOT NULL    COMMENT '포켓몬타입', 
    `Poke_img`    VARCHAR(200)    NOT NULL    COMMENT '포켓몬이미지', 
    `Poke_b_img`  VARCHAR(200)    NOT NULL    COMMENT '포켓몬흑백이미지', 
    `Poke_evol`   VARCHAR(20)     NULL        COMMENT '포켓몬진화', 
     PRIMARY KEY (Poke_num)
);


-- User_info Table Create SQL
-- 테이블 생성 SQL - User_info
CREATE TABLE User_info
(
    `User_id`        VARCHAR(20)     NOT NULL    COMMENT '유저아이디', 
    `User_pw`        VARCHAR(30)     NOT NULL    COMMENT '유저비밀번호', 
    `USer_email`     VARCHAR(30)     NOT NULL    COMMENT '유저이메일', 
    `User_point`     INT             NOT NULL    COMMENT '유저포인트', 
    `User_img`       VARCHAR(200)    NOT NULL    COMMENT '유저이미지', 
    `Main_poke_num`  INT             NULL        COMMENT '대표포켓몬번호', 
     PRIMARY KEY (User_id)
);


-- User_poke_info Table Create SQL
-- 테이블 생성 SQL - User_poke_info
CREATE TABLE User_poke_info
(
    `User_poke_seq`  INT            NOT NULL    AUTO_INCREMENT COMMENT '유저포켓몬번호', 
    `Poke_num`       INT            NOT NULL    COMMENT '포켓몬번호', 
    `User_id`        VARCHAR(20)    NOT NULL    COMMENT '유저아이디', 
    `User_poke_exp`  INT            NOT NULL    COMMENT '유저포켓몬경험치', 
    `User_poke_lv`   INT            NOT NULL    COMMENT '유저포켓몬레벨', 
     PRIMARY KEY (User_poke_seq)
);

-- Foreign Key 설정 SQL - User_poke_info(Poke_num) -> Poke_info(Poke_num)
ALTER TABLE User_poke_info
    ADD CONSTRAINT FK_User_poke_info_Poke_num_Poke_info_Poke_num FOREIGN KEY (Poke_num)
        REFERENCES Poke_info (Poke_num) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - User_poke_info(Poke_num)
-- ALTER TABLE User_poke_info
-- DROP FOREIGN KEY FK_User_poke_info_Poke_num_Poke_info_Poke_num;

-- Foreign Key 설정 SQL - User_poke_info(User_id) -> User_info(User_id)
ALTER TABLE User_poke_info
    ADD CONSTRAINT FK_User_poke_info_User_id_User_info_User_id FOREIGN KEY (User_id)
        REFERENCES User_info (User_id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        

-- Foreign Key 삭제 SQL - User_poke_info(User_id)
-- ALTER TABLE User_poke_info
-- DROP FOREIGN KEY FK_User_poke_info_User_id_User_info_User_id;


-- Scheduler Table Create SQL
-- 테이블 생성 SQL - Scheduler
CREATE TABLE Scheduler
(
    `Schedule_seq`   INT            NOT NULL    AUTO_INCREMENT COMMENT '스케줄번호', 
    `User_id`        VARCHAR(20)    NOT NULL    COMMENT '유저아이디', 
    `Schedule_name`  VARCHAR(30)    NOT NULL    COMMENT '스케줄이름', 
    `Schedule_date`  DATE           NOT NULL    COMMENT '스케줄일정', 
     PRIMARY KEY (Schedule_seq)
);

-- Foreign Key 설정 SQL - Scheduler(User_id) -> User_info(User_id)
ALTER TABLE Scheduler
    ADD CONSTRAINT FK_Scheduler_User_id_User_info_User_id FOREIGN KEY (User_id)
        REFERENCES User_info (User_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - Scheduler(User_id)
-- ALTER TABLE Scheduler
-- DROP FOREIGN KEY FK_Scheduler_User_id_User_info_User_id;


-- User_point_img Table Create SQL
-- 테이블 생성 SQL - User_point_img
CREATE TABLE User_point_img
(
    `Point_img_seq`  INT            NOT NULL    AUTO_INCREMENT COMMENT '포인트이미지번호', 
    `User_id`        VARCHAR(20)    NOT NULL    COMMENT '유저아이디', 
    `Point_img_url`  VARCHAR(50)    NOT NULL    COMMENT '포인트이미지', 
    `Img_date`       DATE           NOT NULL    COMMENT '이미지등록일시', 
     PRIMARY KEY (Point_img_seq)
);

-- Foreign Key 설정 SQL - User_point_img(User_id) -> User_info(User_id)
ALTER TABLE User_point_img
    ADD CONSTRAINT FK_User_point_img_User_id_User_info_User_id FOREIGN KEY (User_id)
        REFERENCES User_info (User_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - User_point_img(User_id)
-- ALTER TABLE User_point_img
-- DROP FOREIGN KEY FK_User_point_img_User_id_User_info_User_id;

-- Attend_info Table Create SQL
-- 테이블 생성 SQL - Attend_info
CREATE TABLE Attend_info
(
    `User_id`     VARCHAR(20)    NOT NULL    COMMENT '유저아이디', 
    `attend_cnt`  INT            NOT NULL    COMMENT '연속출석일수', 
    `check_date`  DATE           NOT NULL    COMMENT '마지막출석'
);

-- Foreign Key 설정 SQL - Attend_info(User_id) -> User_info(User_id)
ALTER TABLE Attend_info
    ADD CONSTRAINT FK_Attend_info_User_id_User_info_User_id FOREIGN KEY (User_id)
        REFERENCES User_info (User_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - Attend_info(User_id)
-- ALTER TABLE Attend_info
-- DROP FOREIGN KEY FK_Attend_info_User_id_User_info_User_id;


-- User_point_log Table Create SQL
-- 테이블 생성 SQL - User_point_log
CREATE TABLE User_point_log
(
    `Point_log_num`   INT            NOT NULL    AUTO_INCREMENT COMMENT '포인트번호', 
    `User_id`         VARCHAR(20)    NOT NULL    COMMENT '유저아이디', 
    `Point_log_date`  DATE           NOT NULL    COMMENT '획득날짜', 
    `get_point`       INT            NOT NULL    COMMENT '획득포인트', 
     PRIMARY KEY (Point_log_num)
);

-- Foreign Key 설정 SQL - User_point_log(User_id) -> User_info(User_id)
ALTER TABLE User_point_log
    ADD CONSTRAINT FK_User_point_log_User_id_User_info_User_id FOREIGN KEY (User_id)
        REFERENCES User_info (User_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - User_point_log(User_id)
-- ALTER TABLE User_point_log
-- DROP FOREIGN KEY FK_User_point_log_User_id_User_info_User_id;

-- 사용자가 출석 체크를 할 때 호출되는 프로시저
DELIMITER //
CREATE PROCEDURE checkAttendance(IN userId VARCHAR(20))
BEGIN
    DECLARE lastCheckDate DATE;
    DECLARE today DATE;
    
    SET today = CURDATE();
    
    -- 마지막 출석일 확인
    SELECT MAX(check_date)
    INTO lastCheckDate
    FROM Attend_info
    WHERE User_id = userId;

    -- 출석 정보가 없으면 첫 출석으로 간주하고 기록 추가
    IF lastCheckDate IS NULL THEN
        INSERT INTO Attend_info (User_id, attend_cnt, check_date)
        VALUES (userId, 1, today);
    ELSE
        -- 마지막 출석일이 어제이면 연속 출석
        IF lastCheckDate = DATE_SUB(today, INTERVAL 1 DAY) THEN
            UPDATE Attend_info
            SET attend_cnt = attend_cnt + 1,
                check_date = today
            WHERE User_id = userId;
        -- 마지막 출석일이 어제가 아니면 연속 출석 초기화
        ELSE
            UPDATE Attend_info
            SET attend_cnt = 1,
                check_date = today
            WHERE User_id = userId;
        END IF;
    END IF;
END //
DELIMITER ;

# CALL checkAttendance('user123'); 프로시저 호출 방법

# 이벤트 스케줄러 활성화
SET GLOBAL event_scheduler = ON;

show grants;

show variables like '%event%';

# 자정마다 user_poke_date 1씩증가
CREATE EVENT increment_user_poke_date
ON SCHEDULE EVERY 1 DAY
STARTS '2024-07-20 00:00:00'
DO
  UPDATE user_poke_info
  SET user_poke_date = user_poke_date + 1;

select * from poke_info;

use Insa5_JSB_hacksim_4;
