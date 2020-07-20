create or replace PACKAGE "MY_PKG" AS 

  /* TODO enter package declarations (types, exceptions, methods etc) here */ 

    type number_aat is table of number
                      index by pls_integer;
    type varchar2_aat is table of varchar2(256)
                      index by pls_integer;

    PROCEDURE get_all_job_by_user (u_id IN NUMBER, output OUT SYS_REFCURSOR); 

    PROCEDURE get_all_job (output OUT SYS_REFCURSOR);

    PROCEDURE get_all_request_by_user (u_id IN NUMBER, output OUT SYS_REFCURSOR); 

    PROCEDURE get_approver (dept_id IN NUMBER, output OUT SYS_REFCURSOR);

    PROCEDURE get_all_request (output OUT SYS_REFCURSOR);

    PROCEDURE get_requests (r_id IN NUMBER, output OUT SYS_REFCURSOR);

    PROCEDURE get_request_details (r_id IN NUMBER, output OUT SYS_REFCURSOR);
    
    PROCEDURE get_request_attachments (r_id IN NUMBER, output OUT SYS_REFCURSOR);

    PROCEDURE get_representatives (p_where IN VARCHAR2, p_rc OUT SYS_REFCURSOR);

    PROCEDURE update_request_details (req IN T_RECTYPE, output OUT VARCHAR2);

    PROCEDURE update_requests (r_id IN NUMBER, r_notes IN VARCHAR2, r_status IN NUMBER, output OUT VARCHAR2);

    PROCEDURE transfer_request (r_id IN NUMBER, r_person_id IN NUMBER, output OUT VARCHAR2);

    PROCEDURE create_requests (p_req_id IN NUMBER
                                , p_priority IN VARCHAR2
                                , p_rep_id  IN NUMBER
                                , p_required_date IN VARCHAR2
                                , p_notes IN VARCHAR2
                                , p_rep_person_id NUMBER
                                , p_created_by NUMBER
                                , p_approved_by NUMBER
                                , p_status NUMBER
--                                , req_dtl_ids number_aat
--                                , sr_type_ids number_aat
--                                , req_remarks varchar2_aat
                                , p_in_rec IN t_rectype
                                , p_attachments IN ATTACHMENT_COLLECTION
                                , p_success OUT VARCHAR2);

      PROCEDURE create_job_order(r_id IN NUMBER,
                                 issued_to IN NUMBER, 
                                 comp_date IN VARCHAR2, 
                                 work_req IN VARCHAR2,
                                 xstatus_report IN VARCHAR2,
                                 xdate_started IN VARCHAR2,
                                 xdate_finished IN VARCHAR2,
                                 xtotal_downtime IN NUMBER,
                                 notes IN VARCHAR2,
                                 xfindings IN VARCHAR2,
                                 completed IN VARCHAR2,
                                 manpower IN T_MANPOWER,
                                 output OUT VARCHAR2);

     PROCEDURE request_completed (r_id IN NUMBER, r_acceptance IN VARCHAR2, output OUT VARCHAR2);

--    PROCEDURE get_requests (p_where IN VARCHAR2, p_rc OUT SYS_REFCURSOR);      

--    PROCEDURE myproc (p_in IN rectype, p_out OUT rectype);

END MY_PKG;