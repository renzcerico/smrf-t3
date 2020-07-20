--------------------------------------------------------
--  DDL for Table TBL_USER
--------------------------------------------------------

  CREATE TABLE "XXDOM"."TBL_USER" 
   (	"ID" NUMBER(*,0), 
	"LAST_NAME" VARCHAR2(255 BYTE), 
	"FIRST_NAME" VARCHAR2(255 BYTE), 
	"MIDDLE_NAME" VARCHAR2(255 BYTE), 
	"USERNAME" VARCHAR2(255 BYTE), 
	"PASSWORD" VARCHAR2(255 BYTE), 
	"USER_LEVEL" VARCHAR2(20 BYTE), 
	"IMG" BLOB, 
	"DEPARTMENT" VARCHAR2(255 BYTE)
   ) ;
--------------------------------------------------------
--  DDL for Index TBL_USER_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "XXDOM"."TBL_USER_PK" ON "XXDOM"."TBL_USER" ("ID");
--------------------------------------------------------
--  DDL for Trigger TBL_USER_AUTO_INCREMENT
--------------------------------------------------------
CREATE SEQUENCE  "TBL_USER_SEQ"  MINVALUE 100 MAXVALUE 9999999999 INCREMENT BY 51 START WITH 100 NOCACHE  NOORDER  NOCYCLE ;

CREATE OR REPLACE TRIGGER "XXDOM"."TBL_USER_AUTO_INCREMENT" 
   before insert on "TBL_USER" 
   for each row 
begin  
   if inserting then 
      if :NEW."ID" is null then 
         select TBL_USER_SEQ.nextval into :NEW."ID" from dual; 
      end if; 
   end if; 
end;


/
ALTER TRIGGER "XXDOM"."TBL_USER_AUTO_INCREMENT" ENABLE;
--------------------------------------------------------
--  Constraints for Table TBL_USER
--------------------------------------------------------

  ALTER TABLE "XXDOM"."TBL_USER" MODIFY ("ID" NOT NULL ENABLE);
  ALTER TABLE "XXDOM"."TBL_USER" ADD CONSTRAINT "TBL_USER_PK" PRIMARY KEY ("ID");
  ALTER TABLE "XXDOM"."TBL_USER" MODIFY ("LAST_NAME" NOT NULL ENABLE);
  ALTER TABLE "XXDOM"."TBL_USER" MODIFY ("FIRST_NAME" NOT NULL ENABLE);
  ALTER TABLE "XXDOM"."TBL_USER" MODIFY ("USERNAME" NOT NULL ENABLE);
  ALTER TABLE "XXDOM"."TBL_USER" MODIFY ("PASSWORD" NOT NULL ENABLE);
  ALTER TABLE "XXDOM"."TBL_USER" MODIFY ("USER_LEVEL" NOT NULL ENABLE);
  
GRANT ALL ON TBL_USER TO APPS;
GRANT ALL ON TBL_USER_SEQ TO APPS;

SET DEFINE OFF;
Insert into TBL_USER (ID,LAST_NAME,FIRST_NAME,MIDDLE_NAME,USERNAME,PASSWORD,USER_LEVEL,DEPARTMENT) values (1,'Cerico','Renz Martin','Chu','renz.cerico','rmCerico','chief','6');
Insert into TBL_USER (ID,LAST_NAME,FIRST_NAME,MIDDLE_NAME,USERNAME,PASSWORD,USER_LEVEL,DEPARTMENT) values (40,'Supervisor','Supervisor','supervisor','supervisor','welcome','head','8');
Insert into TBL_USER (ID,LAST_NAME,FIRST_NAME,MIDDLE_NAME,USERNAME,PASSWORD,USER_LEVEL,DEPARTMENT) values (39,'Requestor','Requestor','requestor','requestor','welcome','requestor','8');
Insert into TBL_USER (ID,LAST_NAME,FIRST_NAME,MIDDLE_NAME,USERNAME,PASSWORD,USER_LEVEL,DEPARTMENT) values (41,'Chief','Chief','chief','chief','welcome','chief','4');
Insert into TBL_USER (ID,LAST_NAME,FIRST_NAME,MIDDLE_NAME,USERNAME,PASSWORD,USER_LEVEL,DEPARTMENT) values (50,'Pena','Vicente',null,'vincent','welcome','head','8');
Insert into TBL_USER (ID,LAST_NAME,FIRST_NAME,MIDDLE_NAME,USERNAME,PASSWORD,USER_LEVEL,DEPARTMENT) values (2,'Llenares','Diether','San Gabriel','dits','diether','chief','6');
Insert into TBL_USER (ID,LAST_NAME,FIRST_NAME,MIDDLE_NAME,USERNAME,PASSWORD,USER_LEVEL,DEPARTMENT) values (3,'Dacula','Bernard','Evangelista','bernard','bernard','supervisor','6');
Insert into TBL_USER (ID,LAST_NAME,FIRST_NAME,MIDDLE_NAME,USERNAME,PASSWORD,USER_LEVEL,DEPARTMENT) values (48,'Bracamonte','Arnel',null,'bracs','bracs','supervisor','4');
Insert into TBL_USER (ID,LAST_NAME,FIRST_NAME,MIDDLE_NAME,USERNAME,PASSWORD,USER_LEVEL,DEPARTMENT) values (49,'Sumook','Rick',null,'rick','rick','supervisor','7');

