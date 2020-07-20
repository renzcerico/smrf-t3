--------------------------------------------------------
--  DDL for Table TBLREQUESTS_DTL
--------------------------------------------------------

  CREATE TABLE "XXDOM"."TBLREQUESTS_DTL" 
   (	"REQ_DTL_ID" NUMBER, 
	"REQ_ID" NUMBER, 
	"SR_TYPE_ID" NUMBER, 
	"CREATION_DATE" DATE, 
	"CREATED_BY" NUMBER, 
	"UPDATED_DATE" DATE, 
	"UPDATED_BY" NUMBER, 
	"REQ_REMARKS" VARCHAR2(254 BYTE)) ;
--------------------------------------------------------
--  DDL for Index TBL_REQUESTS_DTL_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "XXDOM"."TBL_REQUESTS_DTL_PK" ON "XXDOM"."TBLREQUESTS_DTL" ("REQ_DTL_ID");
--------------------------------------------------------
--  DDL for Trigger TBLREQUESTS_DTL_SEQ_TRI
--------------------------------------------------------
CREATE SEQUENCE  "TBLREQUESTS_DTL_SEQ"  MINVALUE 100 MAXVALUE 999999999999999999999999999 INCREMENT BY 1 START WITH 100 NOCACHE  NOORDER  NOCYCLE ;

  CREATE OR REPLACE TRIGGER "XXDOM"."TBLREQUESTS_DTL_SEQ_TRI" 
   before insert on "TBLREQUESTS_DTL" 
   for each row 
begin  
   if inserting then 
      if :NEW."REQ_DTL_ID" is null then 
         select TBLREQUESTS_DTL_SEQ.nextval into :NEW."REQ_DTL_ID" from dual; 
      end if; 
   end if; 
end;


/
ALTER TRIGGER "XXDOM"."TBLREQUESTS_DTL_SEQ_TRI" ENABLE;
--------------------------------------------------------
--  Constraints for Table TBLREQUESTS_DTL
--------------------------------------------------------

ALTER TABLE "XXDOM"."TBLREQUESTS_DTL" ADD CONSTRAINT "TBL_REQUESTS_DTL_PK" PRIMARY KEY ("REQ_DTL_ID");
ALTER TABLE "XXDOM"."TBLREQUESTS_DTL" MODIFY ("SR_TYPE_ID" NOT NULL ENABLE);
ALTER TABLE "XXDOM"."TBLREQUESTS_DTL" MODIFY ("REQ_ID" NOT NULL ENABLE);
ALTER TABLE "XXDOM"."TBLREQUESTS_DTL" MODIFY ("REQ_DTL_ID" NOT NULL ENABLE);

GRANT ALL ON TBLREQUESTS_DTL TO APPS;
GRANT ALL ON TBLREQUESTS_DTL_SEQ TO APPS;
