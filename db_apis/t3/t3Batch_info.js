const oracledb = require('oracledb');
const database = require('../../services/database.js');

const sql = 
    `BEGIN MY_PKG.get_t3batch_info(:header_id, :line_id, :batch_no, :t3_outbv, :t3_outbv2 ); END;`;

const getBatchinfo = async (context) => {

    
    let connect;
    try {

        // console.log(sql)

        const binds = Object.assign({}, context);

        connect = await oracledb.getConnection();
        const t3Header_type = await connect.getDbObjectClass("xxdom.t_t3header_type");
        const t3Material_type = await connect.getDbObjectClass("xxdom.t_t3materials_type");
        
        binds.t3_outbv = {
            dir: oracledb.BIND_OUT,
            type: t3Header_type
        };

        binds.t3_outbv2 = {
            dir: oracledb.BIND_OUT,
            type: t3Material_type
        };
        
        
        result = await database.simpleExecute(sql, binds);
        const data = {
            batch_collection: JSON.parse(JSON.stringify(result.outBinds.t3_outbv)),
            materials_collection: JSON.parse(JSON.stringify(result.outBinds.t3_outbv2)),
            activity_collection: [],
            manpower_collection: []
        }

        return data ;
 
    } catch (erro) {
        console.error(erro);
    } finally {
        if (connect) {
            await connect.close({drop: true});
        }
    }            
};

module.exports.getBatchinfo = getBatchinfo;