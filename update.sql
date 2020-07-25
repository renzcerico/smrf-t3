            -- approx line 295
            COL_ACTIVITY_DOWNTIME := OBJ_ACTIVITY.ACTIVITY_DOWNTIME;
            for ii in 1 .. COL_ACTIVITY_DOWNTIME.count loop
                OBJ_ACTIVITY_DOWNTIME := COL_ACTIVITY_DOWNTIME (ii);
                if OBJ_ACTIVITY_DOWNTIME.IS_NEW = 1 then
                    if OBJ_ACTIVITY_DOWNTIME.IS_DELETED = 0 then
                        INSERT INTO t3_tbl_activity_downtime
                        VALUES (
                            OBJ_ACTIVITY_DOWNTIME.ID
                            , OBJ_ACTIVITY_DOWNTIME.DOWNTIME_TYPE_ID
                            , OBJ_ACTIVITY_DOWNTIME.MINUTES
                            , OBJ_ACTIVITY_DOWNTIME.REMARKS
                            , OBJ_ACTIVITY_DOWNTIME.QUANTITY
                            , actid
                            , OBJ_ACTIVITY_DOWNTIME.CREATED_BY
                            , CURRENT_DATE
                        );
                    end if;
                else
                    if OBJ_ACTIVITY_DOWNTIME.IS_DELETED = 1 then
                        DELETE FROM t3_tbl_activity_downtime
                        WHERE ID = OBJ_ACTIVITY_DOWNTIME.ID;
                    else
                        if OBJ_ACTIVITY_DOWNTIME.IS_CHANGED = 1 then
                            UPDATE t3_tbl_activity_downtime
                            SET DOWNTIME_TYPE_ID    = OBJ_ACTIVITY_DOWNTIME.DOWNTIME_TYPE_ID
                                , MINUTES           = OBJ_ACTIVITY_DOWNTIME.MINUTES
                                , REMARKS           = OBJ_ACTIVITY_DOWNTIME.REMARKS
                                , QUANTITY          = OBJ_ACTIVITY_DOWNTIME.QUANTITY
                            WHERE ID = OBJ_ACTIVITY_DOWNTIME.ID;
                        end if;
                    end if;
                end if;
            end loop;