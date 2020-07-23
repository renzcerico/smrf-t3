-- STORE ALL ACTIVITIES LOOP        
        for i in 1 .. activities.count loop
            OBJ_ACTIVITY := activities (i);
            if OBJ_ACTIVITY.IS_NEW = 1 then
                INSERT INTO tbl_activity
                VALUES (
                OBJ_ACTIVITY.ID
                , output
                , TO_DATE(OBJ_ACTIVITY.START_TIME, 'DD-MON-YYYY HH24:MI:SS')
                , TO_DATE(OBJ_ACTIVITY.END_TIME, 'DD-MON-YYYY HH24:MI:SS')
                , OBJ_ACTIVITY.DOWNTIME
                , OBJ_ACTIVITY.REMARKS
                , user_id
                , CURRENT_DATE
                , CURRENT_DATE
                ) RETURNING ID INTO actid;
            else
                if OBJ_ACTIVITY.IS_CHANGED = 1 then
                    UPDATE tbl_activity
                    SET START_TIME      = TO_DATE(OBJ_ACTIVITY.START_TIME, 'DD-MON-YYYY HH24:MI:SS'),
                        END_TIME        = TO_DATE(OBJ_ACTIVITY.END_TIME, 'DD-MON-YYYY HH24:MI:SS'),
                        DOWNTIME        = OBJ_ACTIVITY.DOWNTIME,
                        REMARKS         = OBJ_ACTIVITY.REMARKS,
                        DATE_UPDATED    = CURRENT_DATE,
                        LAST_UPDATED_BY = user_id
                    WHERE ID = OBJ_ACTIVITY.ID;
                end if;
                actid := OBJ_ACTIVITY.ID;
            end if;

 -- STORE ALL HEADER LOOP
        if obj_header.IS_NEW = 1 then
            INSERT INTO t3_tbl_header 
            VALUES ( obj_header.ID                  
                    , obj_header.BARCODE
                    , TO_DATE(obj_header.ACTUAL_START, 'DD-MON-YYYY HH24:MI:SS')
                    , TO_DATE(obj_header.ACTUAL_END, 'DD-MON-YYYY HH24:MI:SS')           
                    , obj_header.STATUS              
                    , obj_header.PO_NUMBER           
                    , obj_header.CONTROL_NUMBER
                    , TO_DATE(obj_header.SHIPPING_DATE, 'DD-MON-YYYY')                      
                    , obj_header.ORDER_QUANTITY      
                    , obj_header.CUSTOMER            
                    , obj_header.CUSTOMER_CODE       
                    , obj_header.CUSTOMER_SPEC       
                    , obj_header.OLD_CODE            
                    , obj_header.INTERNAL_CODE       
                    , obj_header.PRODUCT_DESCRIPTION
                    , obj_header.SHIFT
                    , TO_DATE(obj_header.SCHEDULE_DATE_START, 'DD-MON-YYYY HH24:MI:SS')
                    , TO_DATE(obj_header.SCHEDULE_DATE_END, 'DD-MON-YYYY HH24:MI:SS')
                    , obj_header.FORWARDED_BY
                    , obj_header.REVIEWED_BY                    
                    , obj_header.APPROVED_BY
                    , obj_header.REVIEWED_AT
                    , obj_header.APPROVED_AT
                    , obj_header.FORWARDED_AT
                    , TO_DATE(obj_header.MFG_DATE, 'DD-MON-YYYY HH24:MI:SS')
                ) RETURNING ID INTO output;
        else
            if obj_header.IS_CHANGED = 1 then
                UPDATE t3_tbl_header
                SET ACTUAL_END      = TO_DATE(obj_header.ACTUAL_END, 'DD-MON-YYYY HH24:MI:SS'),
                    ACTUAL_START    = TO_DATE(obj_header.ACTUAL_START, 'DD-MON-YYYY HH24:MI:SS'),
                    REVIEWED_AT     = TO_DATE(obj_header.REVIEWED_AT, 'DD-MON-YYYY HH24:MI:SS'),
                    APPROVED_AT     = TO_DATE(obj_header.APPROVED_AT, 'DD-MON-YYYY HH24:MI:SS'),
                    FORWARDED_AT    = TO_DATE(obj_header.FORWARDED_AT, 'DD-MON-YYYY HH24:MI:SS'),
                    REVIEWED_BY     = obj_header.REVIEWED_BY,
                    FORWARDED_BY    = obj_header.FORWARDED_BY,
                    APPROVED_BY     = obj_header.APPROVED_BY,
                    STATUS          = obj_header.STATUS,
                    SHIFT           = obj_header.SHIFT,
                    MFG_DATE        = TO_DATE(obj_header.MFG_DATE, 'DD-MON-YYYY HH24:MI:SS')
                WHERE ID = obj_header.ID;
            end if;
            output := obj_header.ID;
        end if;


        -- DELETE PROCEDURE GET_ALL_BY_BARCODE