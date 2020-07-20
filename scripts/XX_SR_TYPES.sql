--------------------------------------------------------
--  DDL for Table XX_SR_TYPES
--------------------------------------------------------

  CREATE TABLE "XXDOM"."XX_SR_TYPES" 
   (	"SR_TYPE_ID" NUMBER, 
	"SR_TYPE_CODE" VARCHAR2(20 BYTE), 
	"SR_TYPE_NAME" VARCHAR2(140 BYTE), 
	"REP_ID" NUMBER
   ) ;
--------------------------------------------------------
--  DDL for Index SR_TYPES_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "XXDOM"."SR_TYPES_PK" ON "XXDOM"."XX_SR_TYPES" ("SR_TYPE_ID") ;
--------------------------------------------------------
--  DDL for Trigger XX_SRF_TYPES_SEQ_TRI
--------------------------------------------------------

CREATE SEQUENCE  "SR_TYPES_SEQ"  MINVALUE 100 MAXVALUE 99999999999 INCREMENT BY 1 START WITH 123 NOCACHE  NOORDER  NOCYCLE ;

  CREATE OR REPLACE TRIGGER "XXDOM"."XX_SRF_TYPES_SEQ_TRI" 
  BEFORE INSERT ON XX_SR_TYPES
  FOR EACH ROW

BEGIN
  SELECT SR_TYPES_SEQ.NEXTVAL
  INTO   :NEW.sr_type_id
  FROM   DUAL;
END XX_SRF_TYPES_SEQ_TRI;
/
ALTER TRIGGER "XXDOM"."XX_SRF_TYPES_SEQ_TRI" ENABLE;
--------------------------------------------------------
--  Constraints for Table XX_SR_TYPES
--------------------------------------------------------

  ALTER TABLE "XXDOM"."XX_SR_TYPES" ADD CONSTRAINT "SR_TYPES_PK" PRIMARY KEY ("SR_TYPE_ID");
  
GRANT ALL ON XX_SR_TYPES TO APPS;
GRANT ALL ON SR_TYPES_SEQ TO APPS;

SET DEFINE OFF;
Insert into XX_SR_TYPES (SR_TYPE_ID,SR_TYPE_CODE,SR_TYPE_NAME,REP_ID) values (100,'EMDXX01','Machine Setup/Adjustments',100);
Insert into XX_SR_TYPES (SR_TYPE_ID,SR_TYPE_CODE,SR_TYPE_NAME,REP_ID) values (101,'EMDXX02','Machine Repair/Replacement',100);
Insert into XX_SR_TYPES (SR_TYPE_ID,SR_TYPE_CODE,SR_TYPE_NAME,REP_ID) values (102,'MISIT01','Hardware Problem ',101);
Insert into XX_SR_TYPES (SR_TYPE_ID,SR_TYPE_CODE,SR_TYPE_NAME,REP_ID) values (103,'MISIT02','Software Installation/ Error',101);
Insert into XX_SR_TYPES (SR_TYPE_ID,SR_TYPE_CODE,SR_TYPE_NAME,REP_ID) values (104,'MISDEV01','ERP Account Request',102);
Insert into XX_SR_TYPES (SR_TYPE_ID,SR_TYPE_CODE,SR_TYPE_NAME,REP_ID) values (105,'MISDEV02','ERP Systems Error',102);
