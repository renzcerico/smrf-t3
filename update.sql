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