--------------------------------------------------------
--  DDL for Table TBL_JOB_ORDER
--------------------------------------------------------

  CREATE TABLE "XXDOM"."TBL_JOB_ORDER" 
   (	"ID" NUMBER(10,0), 
	"REQUEST_ID" NUMBER, 
	"WORK_REQUIRED" VARCHAR2(255 BYTE), 
	"PROBLEM_DESCRIPTION" VARCHAR2(255 BYTE), 
	"ISSUED_TO" NUMBER, 
	"DATE_REQUIRED" DATE, 
	"STATUS_REPORT" VARCHAR2(255 BYTE), 
	"DATE_STARTED" DATE, 
	"DATE_FINISHED" DATE, 
	"TOTAL_DOWNTIME" NUMBER, 
	"ACCEPTANCE" VARCHAR2(255 BYTE), 
	"RATING" VARCHAR2(255 BYTE), 
	"REMARKS" VARCHAR2(255 BYTE), 
	"STATUS" VARCHAR2(255 BYTE), 
	"CREATED_BY" NUMBER, 
	"CREATED_AT" DATE, 
	"UPDATED_AT" DATE
   ) ;
--------------------------------------------------------
--  DDL for Index TBL_JOB_ORDER_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "XXDOM"."TBL_JOB_ORDER_PK" ON "XXDOM"."TBL_JOB_ORDER" ("ID");
--------------------------------------------------------
--  DDL for Trigger TBL_JOB_ORDER_AUTO_INC
--------------------------------------------------------

CREATE SEQUENCE  "TBL_JOB_ORDER_SEQ"  MINVALUE 100 MAXVALUE 999999999 INCREMENT BY 1 START WITH 100 NOCACHE  NOORDER  NOCYCLE ;

  CREATE OR REPLACE TRIGGER "XXDOM"."TBL_JOB_ORDER_AUTO_INC" 
   before insert on "TBL_JOB_ORDER" 
   for each row 
begin  
   if inserting then 
      if :NEW."ID" is null then 
         select TBL_JOB_ORDER_SEQ.nextval into :NEW."ID" from dual; 
      end if; 
   end if; 
end;


/
ALTER TRIGGER "XXDOM"."TBL_JOB_ORDER_AUTO_INC" ENABLE;
--------------------------------------------------------
--  Constraints for Table TBL_JOB_ORDER
--------------------------------------------------------

ALTER TABLE "XXDOM"."TBL_JOB_ORDER" MODIFY ("ID" NOT NULL ENABLE);
ALTER TABLE "XXDOM"."TBL_JOB_ORDER" ADD CONSTRAINT "TBL_JOB_ORDER_PK" PRIMARY KEY ("ID");

GRANT ALL ON TBL_JOB_ORDER TO APPS;
GRANT ALL ON TBL_JOB_ORDER_SEQ TO APPS;
