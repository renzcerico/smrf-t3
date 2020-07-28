-- APPROX LINE #: 199
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
                ) RETURNING ID INTO output;


-- DELETE PROCEDURE GET_ALL_BY_BARCODE