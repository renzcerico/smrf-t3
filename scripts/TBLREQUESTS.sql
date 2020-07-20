--------------------------------------------------------
--  DDL for Table TBLREQUESTS
--------------------------------------------------------

  CREATE TABLE "XXDOM"."TBLREQUESTS" 
   (	"REQ_ID" NUMBER, 
	"REQ_PRIORITY" VARCHAR2(10 BYTE), 
	"REP_ID" NUMBER, 
	"DATE_REQUIRED" DATE, 
	"NOTES" VARCHAR2(254 BYTE), 
	"CREATION_DATE" DATE, 
	"CREATED_BY" NUMBER, 
	"UPDATED_DATE" DATE, 
	"UPDATED_BY" NUMBER, 
	"REP_PERSON_ID" NUMBER, 
	"REQ_STATUS" NUMBER, 
	"APPROVED_BY" NUMBER) ;
--------------------------------------------------------
--  DDL for Index TBLREQUESTS_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "XXDOM"."TBLREQUESTS_PK" ON "XXDOM"."TBLREQUESTS" ("REQ_ID");
--------------------------------------------------------
--  DDL for Trigger TBLREQUESTS_SEQ_TRI
--------------------------------------------------------
CREATE SEQUENCE  "TBLREQUESTS_SEQ"  MINVALUE 100 MAXVALUE 999999999999999999999999999 INCREMENT BY 1 START WITH 100 NOCACHE  NOORDER  NOCYCLE ;

  CREATE OR REPLACE TRIGGER "XXDOM"."TBLREQUESTS_SEQ_TRI" 
   before insert on "TBLREQUESTS" 
   for each row 
begin  
   if inserting then 
      if :NEW."REQ_ID" is null then 
         select TBLREQUESTS_SEQ.nextval into :NEW."REQ_ID" from dual; 
      end if; 
   end if; 
end;


/
ALTER TRIGGER "XXDOM"."TBLREQUESTS_SEQ_TRI" ENABLE;
--------------------------------------------------------
--  Constraints for Table TBLREQUESTS
--------------------------------------------------------

ALTER TABLE "XXDOM"."TBLREQUESTS" ADD CONSTRAINT "TBLREQUESTS_PK" PRIMARY KEY ("REQ_ID");
ALTER TABLE "XXDOM"."TBLREQUESTS" MODIFY ("REQ_ID" NOT NULL ENABLE);
  
GRANT ALL ON TBLREQUESTS TO APPS;
GRANT ALL ON TBLREQUESTS_SEQ TO APPS;
