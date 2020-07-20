create or replace PACKAGE BODY "MY_PKG" AS

    PROCEDURE request_completed (r_id IN NUMBER, r_acceptance IN VARCHAR2, output OUT VARCHAR2) AS

    BEGIN
        UPDATE tblrequests SET req_status = 4 WHERE req_id = r_id;      
        UPDATE tbl_job_order SET acceptance = r_acceptance WHERE request_id = r_id;

        COMMIT;
        output := 'Y';
    END request_completed;

    PROCEDURE get_all_job (output OUT SYS_REFCURSOR) AS

    BEGIN
        OPEN output FOR 
        SELECT 
            r.*, 
            CONCAT( CONCAT(SUBSTR(sr.FIRST_NAME, 1, 1), '. '), sr.LAST_NAME ) as NAME,
            CONCAT( CONCAT(SUBSTR(a.FIRST_NAME, 1, 1), '. '), a.LAST_NAME ) as NAME_CREATED_BY
        FROM tblrequests r
            LEFT JOIN tbl_user sr ON sr.id= r.REP_PERSON_ID
            LEFT JOIN tbl_user a ON a.id = r.CREATED_BY
        WHERE r.req_status IN (1, 2, 3)
        ORDER BY r.REQ_STATUS ASC, r.REQ_ID DESC;

    END get_all_job;

    PROCEDURE get_all_job_by_user (u_id IN NUMBER, output OUT SYS_REFCURSOR) AS
    user_level VARCHAR2(255);
    req_status VARCHAR2(255);

    BEGIN
        SELECT u.user_level INTO user_level FROM tbl_user u WHERE u.id = u_id;

        IF (user_level = 'supervisor' OR user_level = 'head') THEN
            req_status := '1,2,3,4';  
        ELSIF (user_level = 'chief') THEN
            req_status := '2,3';  
        END IF;

        OPEN output FOR 
        SELECT 
            r.*, 
            j.ISSUED_TO,
            CONCAT( CONCAT(SUBSTR(sr.FIRST_NAME, 1, 1), '. '), sr.LAST_NAME ) as NAME,
            CONCAT( CONCAT(SUBSTR(a.FIRST_NAME, 1, 1), '. '), a.LAST_NAME )  as NAME_CREATED_BY
        FROM tblrequests r
            LEFT JOIN tbl_user sr ON sr.id= r.REP_PERSON_ID
            LEFT JOIN tbl_user a ON a.id = r.CREATED_BY
            LEFT JOIN tbl_job_order j ON j.REQUEST_ID = r.REQ_ID
        WHERE
              (r.rep_person_id = u_id AND
              r.req_status IN req_status) OR
              r.req_id IN (SELECT jo.request_id FROM tbl_job_order jo WHERE jo.issued_to = u_id)
        ORDER BY r.REQ_STATUS ASC, r.REQ_ID DESC;

    END get_all_job_by_user;

    PROCEDURE get_all_request_by_user (u_id IN NUMBER, output OUT SYS_REFCURSOR) AS
    user_level VARCHAR2(255);

    BEGIN
        SELECT u.user_level INTO user_level FROM tbl_user u WHERE u.id = u_id;

        IF user_level = 'requestor' THEN
            OPEN output FOR 
            SELECT 
                r.*, 
                CONCAT( CONCAT(SUBSTR(sr.FIRST_NAME, 1, 1), '. '), sr.LAST_NAME ) as NAME,
                CONCAT( CONCAT(SUBSTR(a.FIRST_NAME, 1, 1), '. '), a.LAST_NAME )  as NAME_CREATED_BY
            FROM tblrequests r
                LEFT JOIN tbl_user sr ON sr.id= r.REP_PERSON_ID
                LEFT JOIN tbl_user a ON a.id = r.APPROVED_BY
            WHERE (r.rep_person_id = u_id OR r.created_by = u_id) AND
                  r.req_status IN (0, 1, 2, 3, 4)
            ORDER BY r.REQ_STATUS ASC, r.REQ_ID DESC;
        ELSE
            OPEN output FOR 
            SELECT 
                r.*, 
                CONCAT( CONCAT(SUBSTR(sr.FIRST_NAME, 1, 1), '. '), sr.LAST_NAME ) as NAME,
                CONCAT( CONCAT(SUBSTR(a.FIRST_NAME, 1, 1), '. '), a.LAST_NAME )  as NAME_CREATED_BY
            FROM tblrequests r
                LEFT JOIN tbl_user sr ON sr.id= r.REP_PERSON_ID
                LEFT JOIN tbl_user a ON a.id = r.CREATED_BY
                LEFT JOIN tbl_job_order jo ON jo.request_id = r.req_id
            WHERE (r.created_by = u_id OR
--                  r.rep_person_id = u_id OR
                  r.approved_by = u_id) AND
                  r.req_status IN (0, 1, 2, 3) OR
                  (r.rep_person_id = u_id AND
                  r.req_status IN (3, 4)) OR
                  (jo.issued_to = u_id AND r.req_status IN (3, 4))
            ORDER BY r.REQ_STATUS ASC, r.REQ_ID DESC;
        END IF;

    END get_all_request_by_user;

    PROCEDURE get_approver (dept_id IN NUMBER, output OUT SYS_REFCURSOR) AS

    BEGIN
        OPEN output FOR
        SELECT
            id,
            CONCAT(CONCAT(SUBSTR(first_name, 1,1), '. '), LAST_NAME) as name
        FROM tbl_user where department = dept_id AND (user_level = 'supervisor' or user_level = 'head');
    END get_approver;

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
                                 output OUT VARCHAR2) AS
    JOB_ORDER_ID NUMBER;
    IS_EXISTS NUMBER := 0;
    BEGIN
        BEGIN

            SELECT TO_NUMBER(jo.ID) INTO IS_EXISTS FROM tbl_job_order jo WHERE jo.request_id = r_id;
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    NULL;
        END;
    
        IF IS_EXISTS > 0 THEN
            
            UPDATE tbl_job_order SET
                 request_id     = r_id,
                 issued_to      = issued_to,
                 work_required  = work_req,
                 date_required  = TO_DATE(comp_date, 'YYYY-MM-DD HH24:MI:SS'),
                 status_report  = xstatus_report,
                 date_started   = TO_DATE(xdate_started, 'YYYY-MM-DD HH24:MI:SS'),
                 date_finished  = TO_DATE(xdate_finished, 'YYYY-MM-DD HH24:MI:SS'),
                 total_downtime = xtotal_downtime,
                 remarks        = notes,
                 findings       = xfindings
            WHERE id = IS_EXISTS;

            IF manpower.count > 0 THEN
                FOR i IN 1..manpower.count
                LOOP
                    IF (manpower(i).IS_NEW = 'true') THEN
                        INSERT INTO TBL_MANPOWER
                            (job_order_id, manpower_id)
                            values
                            (IS_EXISTS, manpower(i).M_ID);
                    ELSIF (manpower(i).IS_NEW = 'deleted') THEN
                        DELETE FROM TBL_MANPOWER WHERE id = manpower(i).ID;
                    ELSE
                        UPDATE TBL_MANPOWER SET
                            manpower_id = manpower(i).M_ID
                        WHERE id = manpower(i).ID;               
                    END IF;
                END LOOP;
            END IF;

            IF (completed = 'true') THEN
                UPDATE tblrequests SET req_status = 3 WHERE req_id = r_id;
                UPDATE tbl_job_order SET status = 1 WHERE id = IS_EXISTS;
            END IF;

        ELSE

            INSERT INTO tbl_job_order
                (request_id,
                 issued_to,
                 work_required,
                 date_required,
                 status_report,
                 date_started,
                 date_finished,
                 total_downtime,
                 remarks,
                 findings)
                VALUES 
                (r_id,
                 issued_to,
                 work_req,
                 TO_DATE(comp_date, 'YYYY-MM-DD HH24:MI:SS'),
                 xstatus_report,
                 TO_DATE(xdate_started, 'YYYY-MM-DD HH24:MI:SS'),
                 TO_DATE(xdate_finished, 'YYYY-MM-DD HH24:MI:SS'),
                 xtotal_downtime,
                 notes,
                 xfindings) RETURNING ID INTO JOB_ORDER_ID;

            UPDATE tblrequests SET req_status = 2 WHERE req_id = r_id;
            
            IF manpower.count > 0 THEN
                FOR i IN 1..manpower.count
                LOOP
                    INSERT INTO TBL_MANPOWER
                        (job_order_id, manpower_id)
                        values
                        (JOB_ORDER_ID, manpower(i).M_ID);
                END LOOP;
            END IF;

        END IF;

        COMMIT;
        output := 'Y';

--        EXCEPTION 
--            WHEN OTHERS THEN
--            NULL;

    END create_job_order;

    PROCEDURE transfer_request (r_id IN NUMBER, r_person_id IN NUMBER, output OUT VARCHAR2) AS

    BEGIN
        UPDATE tblrequests
            SET rep_person_id = r_person_id
            WHERE req_id = r_id;
        COMMIT;
        output := 'Y';

    END transfer_request;

    PROCEDURE update_request_details (req IN T_RECTYPE, output OUT VARCHAR2) AS

    BEGIN
        FOR i IN 1 .. req.count
        LOOP
            UPDATE tblrequests_dtl
                SET sr_type_id = req(i).SR_TYPE_ID,
                    req_remarks = req(i).REQ_REMARKS,
                    updated_date = SYSDATE
            WHERE req_dtl_id = req(i).REQ_DTL_ID;
        END LOOP;

        COMMIT;
        output := 'Y';
    END update_request_details;

    PROCEDURE update_requests (r_id IN NUMBER, r_notes IN VARCHAR2, r_status IN NUMBER, output OUT VARCHAR2) AS

    BEGIN
        UPDATE tblrequests
            SET req_status = r_status,
                notes = r_notes
        WHERE req_id = r_id;

        COMMIT;
        output := 'Y';

    END update_requests;

    PROCEDURE get_all_request (output OUT SYS_REFCURSOR) AS

    BEGIN
        OPEN output FOR 
        SELECT 
            r.*, 
            CONCAT( CONCAT(SUBSTR(sr.FIRST_NAME, 1, 1), '. '), sr.LAST_NAME ) as NAME,
            CONCAT( CONCAT(SUBSTR(a.FIRST_NAME, 1, 1), '. '), a.LAST_NAME )  as NAME_CREATED_BY
        FROM tblrequests r
            LEFT JOIN tbl_user sr ON sr.id= r.REP_PERSON_ID
            LEFT JOIN tbl_user a ON a.id = r.CREATED_BY
        WHERE r.req_status IN (0, 1, 2, 3, 4)
        ORDER BY r.REQ_STATUS ASC, r.REQ_ID DESC;

    END get_all_request;

    PROCEDURE get_requests(r_id IN NUMBER, output OUT SYS_REFCURSOR) AS

    BEGIN

       OPEN output FOR
       SELECT
            CONCAT( CONCAT(SUBSTR(u.FIRST_NAME, 1, 1), '. '), u.LAST_NAME) REQ_REQUESTED_BY,
            CONCAT( CONCAT(SUBSTR(sr.FIRST_NAME, 1, 1), '. '), sr.LAST_NAME) REQ_SR_REPRESENTATIVE,
            r.req_id req_id,
            r.req_priority req_priority,
            r.rep_id req_rep_id,
            r.date_required req_date_required,
            r.notes req_notes,
            r.creation_date req_creation_date,
            r.created_by req_created_by,
            r.updated_date req_updated_date,
            r.updated_by req_updated_by,
            r.rep_person_id req_person_id,
            r.req_status req_status,
            r.approved_by,
            (SELECT 
                CONCAT( CONCAT(SUBSTR(xs.first_name, 1, 1), '. '), xs.last_name )
            FROM tbl_user xs
            WHERE 
--                xs.department = u.department AND
                  xs.id = r.approved_by
--                 xs.user_level = 'head'
                 ) dept_head
--                  OR xs.user_level = 'supervisor')
        FROM tblrequests r
        LEFT JOIN tbl_user u ON u.id = r.created_by
        LEFT JOIN tbl_user sr ON sr.id= r.REP_PERSON_ID
        WHERE r.req_id = r_id;

    END get_requests;

    PROCEDURE get_request_details (r_id IN NUMBER, output OUT SYS_REFCURSOR) AS

    BEGIN

       OPEN output FOR
       SELECT
            s.sr_type_name dtl_name,
            d.req_dtl_id dtl_id,
            d.req_id dtl_req_id,
            d.sr_type_id dtl_sr_type_id,
            d.req_remarks dtl_remarks
        FROM tblrequests r
        LEFT JOIN tblrequests_dtl d ON r.req_id = d.req_id
        LEFT JOIN XX_SR_TYPES s ON s.sr_type_id = d.sr_type_id
        WHERE r.req_id = r_id;

    END get_request_details;

    PROCEDURE get_request_attachments (r_id IN NUMBER, output OUT SYS_REFCURSOR) AS

    BEGIN

       OPEN output FOR
       SELECT *
        FROM tbl_attachment
        WHERE req_id = r_id;

    END get_request_attachments;

    PROCEDURE get_representatives (p_where IN VARCHAR2, p_rc OUT SYS_REFCURSOR) AS

     BEGIN

        OPEN p_rc FOR 
            SELECT xsr.*
                    , CONCAT(CONCAT(u.LAST_NAME, ', '), u.FIRST_NAME) full_name
                FROM tbl_user u
                    , xx_sr_representatives xsr
                WHERE xsr.person_id = u.id;

    END get_representatives;

    PROCEDURE create_requests (p_req_id IN NUMBER
                                , p_priority IN VARCHAR2
                                , p_rep_id  IN NUMBER
                                , p_required_date IN VARCHAR2
                                , p_notes IN VARCHAR2
                                , p_rep_person_id NUMBER
                                , p_created_by NUMBER
                                , p_approved_by NUMBER
                                , p_status NUMBER
                                , p_in_rec IN t_rectype
                                , p_attachments IN ATTACHMENT_COLLECTION
                                , p_success OUT VARCHAR2)
        IS

        v_request_id NUMBER;

    BEGIN

        v_request_id := p_req_id;

        IF v_request_id <= 0 THEN

            INSERT INTO tblrequests (
                    req_priority,
                    rep_id,
                    date_required,
                    notes,
                    creation_date,
                    rep_person_id,
                    created_by,
                    approved_by,
                    req_status
                ) VALUES (
                    p_priority,
                    p_rep_id,
                    TO_DATE(p_required_date, 'DD-Mon-YYYY HH24:MI:SS'),
                    p_notes,
                    SYSDATE,
                    p_rep_person_id,
                    p_created_by,
                    p_approved_by,
                    p_status
                ) RETURNING req_id INTO v_request_id;

        END IF;
        
        IF p_attachments.count > 0 THEN
            FOR a IN p_attachments.FIRST .. p_attachments.LAST LOOP
                INSERT INTO tbl_attachment (
                        id,
                        req_id,
                        img,
                        created_date
                    ) VALUES (
                        null,
                        v_request_id,
                        p_attachments(a).IMG,
                        SYSDATE
                    );
            END LOOP;
        END IF;
        
        FOR i IN p_in_rec.FIRST .. p_in_rec.LAST LOOP
            IF (p_in_rec(i).req_dtl_id = 0) THEN 
                INSERT INTO tblrequests_dtl (
                        req_id,
                        sr_type_id,
                        req_remarks,
                        creation_date
                    ) VALUES (
                        v_request_id,
                        p_in_rec(i).sr_type_id,
                        p_in_rec(i).req_remarks,
                        SYSDATE
                    );
            END IF;

        END LOOP;

        COMMIT;

        p_success := 'Y' ;        

    EXCEPTION
        WHEN OTHERS THEN
        ROLLBACK;

        p_success := SQLERRM || ' ' || DBMS_UTILITY.FORMAT_ERROR_BACKTRACE;

    END create_requests;  

END MY_PKG;