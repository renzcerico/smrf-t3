CREATE OR REPLACE TYPE "RECTYPE" AS OBJECT 
( /* TODO enter attribute and method declarations here */ 
    REQ_DTL_ID NUMBER,
    REQ_REMARKS VARCHAR2(254),
    SR_TYPE_ID NUMBER
);

create or replace type t_rectype as table of rectype;    

GRANT ALL ON RECTYPE TO APPS;
GRANT ALL ON t_rectype TO APPS;