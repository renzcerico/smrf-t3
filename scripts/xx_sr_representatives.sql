 CREATE TABLE "XXDOM"."XX_SR_REPRESENTATIVES" 
   ("REP_ID" NUMBER, 
	"REP_CODE" VARCHAR2(20 BYTE), 
	"REP_NAME" VARCHAR2(140 BYTE), 
	"PERSON_ID" NUMBER
   ) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 106496 NEXT 106496 MINEXTENTS 1 MAXEXTENTS 505
  PCTINCREASE 100 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT)
  TABLESPACE "SYSTEM" ;

CREATE UNIQUE INDEX "XXDOM"."SR_REP_PK" ON "XXDOM"."XX_SR_REPRESENTATIVES" ("REP_ID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 
  STORAGE(INITIAL 106496 NEXT 106496 MINEXTENTS 1 MAXEXTENTS 505
  PCTINCREASE 100 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT)
  TABLESPACE "SYSTEM" ;
  
CREATE SEQUENCE  "SR_REPRESENTATIVES_SEQ"  MINVALUE 100 MAXVALUE 99999999999 INCREMENT BY 1 START WITH 100 NOCACHE  NOORDER  NOCYCLE ;

CREATE OR REPLACE TRIGGER "XXDOM"."XX_SR_REPRESENTATIVES_SEQ_TRI" 
  BEFORE INSERT ON XX_SR_REPRESENTATIVES
  FOR EACH ROW

BEGIN
  SELECT SR_REPRESENTATIVES_SEQ.NEXTVAL
  INTO   :NEW.REP_ID
  FROM   DUAL;
END XX_SR_REPRESENTATIVES_SEQ_TRI;
/
ALTER TRIGGER "XXDOM"."XX_SR_REPRESENTATIVES_SEQ_TRI" ENABLE;

GRANT ALL ON XX_SR_REPRESENTATIVES TO APPS;
GRANT ALL ON SR_REPRESENTATIVES_SEQ TO APPS;

REM INSERTING into XX_SR_REPRESENTATIVES
SET DEFINE OFF;
Insert into XX_SR_REPRESENTATIVES (REP_ID,REP_CODE,REP_NAME,PERSON_ID) values (100,'EMD','EMD',48);
Insert into XX_SR_REPRESENTATIVES (REP_ID,REP_CODE,REP_NAME,PERSON_ID) values (101,'MIS-IT','MIS - IT',49);
Insert into XX_SR_REPRESENTATIVES (REP_ID,REP_CODE,REP_NAME,PERSON_ID) values (102,'MIS-DEV','MIS - Programmer',3);
