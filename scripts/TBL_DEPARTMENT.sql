--------------------------------------------------------
--  DDL for Table TBL_DEPARTMENT
--------------------------------------------------------

  CREATE TABLE "XXDOM"."TBL_DEPARTMENT" 
   (	"ID" NUMBER, 
	"NAME" VARCHAR2(255 BYTE), 
	"STATUS" VARCHAR2(20 BYTE)
   );
--------------------------------------------------------
--  DDL for Trigger TBL_DEPARTMENT_AUTO_INCREMENT
--------------------------------------------------------
CREATE SEQUENCE  "TBL_DEPARTMENT_SEQ"  MINVALUE 1 MAXVALUE 9999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE ;

  CREATE OR REPLACE TRIGGER "XXDOM"."TBL_DEPARTMENT_AUTO_INCREMENT" 
   before insert on "TBL_DEPARTMENT" 
   for each row 
begin  
   if inserting then 
      if :NEW."ID" is null then 
         select TBL_DEPARTMENT_SEQ.nextval into :NEW."ID" from dual; 
      end if; 
   end if; 
end;


/
ALTER TRIGGER "XXDOM"."TBL_DEPARTMENT_AUTO_INCREMENT" ENABLE;

GRANT ALL ON TBL_DEPARTMENT TO APPS;
GRANT ALL ON TBL_DEPARTMENT_SEQ TO APPS;

--------------------------------------------------------
--  File created - Thursday-June-11-2020   
--------------------------------------------------------
SET DEFINE OFF;
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (1,'ADMIN',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (2,'DED',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (3,'EHSD',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (4,'EMD',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (5,'IPD',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (6,'OVP - Developer',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (7,'OVP - IT',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (8,'OPT',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (9,'OPT - 2',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (10,'PCD',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (11,'QAD',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (12,'RSD',null);
Insert into TBL_DEPARTMENT (ID,NAME,STATUS) values (13,'WHS',null);
