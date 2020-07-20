--------------------------------------------------------
--  DDL for Table TBL_ASSIGNED_REP
--------------------------------------------------------

CREATE TABLE "XXDOM"."TBL_ASSIGNED_REP" 
    (	"ID" NUMBER, 
    "REQUEST_LIST_ID" NUMBER, 
    "DEPARTMENT_ID" NUMBER) ;
--------------------------------------------------------
--  DDL for Index TBL_ASSIGNED_DEPARTMENT_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "XXDOM"."TBL_ASSIGNED_DEPARTMENT_PK" ON "XXDOM"."TBL_ASSIGNED_REP" ("ID");
--------------------------------------------------------
--  DDL for Trigger TBL_ASSIGNED_AUTO_INCREMENT
--------------------------------------------------------

CREATE SEQUENCE  "TBL_ASSIGNED_DEPARTMENT_SEQ"  MINVALUE 1 MAXVALUE 9999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE ;

  CREATE OR REPLACE TRIGGER "XXDOM"."TBL_ASSIGNED_AUTO_INCREMENT" 
   before insert on "TBL_ASSIGNED_REP" 
   for each row 
begin  
   if inserting then 
      if :NEW."ID" is null then 
         select TBL_ASSIGNED_DEPARTMENT_SEQ.nextval into :NEW."ID" from dual; 
      end if; 
   end if; 
end;

/
ALTER TRIGGER "XXDOM"."TBL_ASSIGNED_AUTO_INCREMENT" ENABLE;
--------------------------------------------------------
--  Constraints for Table TBL_ASSIGNED_REP
--------------------------------------------------------

ALTER TABLE "XXDOM"."TBL_ASSIGNED_REP" MODIFY ("ID" NOT NULL ENABLE);
ALTER TABLE "XXDOM"."TBL_ASSIGNED_REP" ADD CONSTRAINT "TBL_ASSIGNED_DEPARTMENT_PK" PRIMARY KEY ("ID");

GRANT ALL ON TBL_ASSIGNED_REP TO APPS;
GRANT ALL ON TBL_ASSIGNED_DEPARTMENT_SEQ TO APPS;

-------------------------------------------------------
--  File created - Thursday-June-11-2020   
--------------------------------------------------------
REM INSERTING into TBL_ASSIGNED_REP
SET DEFINE OFF;
Insert into TBL_ASSIGNED_REP (ID,REQUEST_LIST_ID,DEPARTMENT_ID) values (1,4,1);
Insert into TBL_ASSIGNED_REP (ID,REQUEST_LIST_ID,DEPARTMENT_ID) values (2,5,1);
Insert into TBL_ASSIGNED_REP (ID,REQUEST_LIST_ID,DEPARTMENT_ID) values (3,7,2);
Insert into TBL_ASSIGNED_REP (ID,REQUEST_LIST_ID,DEPARTMENT_ID) values (4,8,2);
Insert into TBL_ASSIGNED_REP (ID,REQUEST_LIST_ID,DEPARTMENT_ID) values (5,10,3);
Insert into TBL_ASSIGNED_REP (ID,REQUEST_LIST_ID,DEPARTMENT_ID) values (6,11,3);

  
