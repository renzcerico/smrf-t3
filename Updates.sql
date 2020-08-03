-- APPROX LINE #: 198
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
                    , obj_header.STD_OUTPUT
                    , obj_header.GRP_NUM
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
                    GRP_NUM         = obj_header.GRP_NUM
                WHERE ID = obj_header.ID;
            end if;
            output := obj_header.ID;
        end if;



-- DELETE PROCEDURE GET_ALL_BY_BARCODE