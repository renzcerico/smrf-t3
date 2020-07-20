const oracle = require('oracledb');
const database = require('../../services/database.js');

// const header = {
//       ID:             NULL
//     , BARCODE:        '12345'
//     , ACTUAL_START:   '27/FEB/20'
//     , ACTUAL_END:     '27/FEB/20'
//     , STATUS:         'GOOD AF'
//     , PO_NUMBER:      '6969'
//     , CONTROL_NUMBER: '67890'
//     , SHIPPING_DATE:  '27/FEB/20'
//     , ORDER_QUANTITY: 500
//     , CUSTOMER:       'KEVIN VIRAY'
//     , CUSTOMER_CODE:  'GG111'
//     , CUSTOMER_SPEC:  'GGGGS'
//     , OLD_CODE:       '555'
//     , INTERNAL_CODE:  '666'
//     , PRODUCT_DESC:   'DESC' 
// }

const qry = `
DECLARE
    OBJ_HEADER      TBL_HEADER%ROWTYPE;
    OBJ_ACTIVITY    TBL_ACTIVITY%ROWTYPE;
    OBJ_MATERIAL    TBL_MATERIAL%ROWTYPE;
    OBJ_MANPOWER    TBL_MANPOWER%ROWTYPE;

    ACTIVITIES  ${process.env.SCHEMA}.T3_PACKAGE.ACTIVITY_COLLECTION   := ${process.env.SCHEMA}.T3_PACKAGE.ACTIVITY_COLLECTION();
    MANPOWER    ${process.env.SCHEMA}.T3_PACKAGE.MANPOWER_COLLECTION   := ${process.env.SCHEMA}.T3_PACKAGE.MANPOWER_COLLECTION();
    MATERIALS   ${process.env.SCHEMA}.T3_PACKAGE.MATERIAL_COLLECTION   := ${process.env.SCHEMA}.T3_PACKAGE.MATERIAL_COLLECTION();

    RETURN BOOLEAN;
BEGIN

SELECT NULL
    ,'12345'
    , '27/FEB/20'
    , '27/FEB/20'
    , 'GOOD AF'
    , '6969'
    , '67890'
    , '27/FEB/20'
    , 500
    , 'KEVIN VIRAY'
    , 'GG111'
    , 'GGGGS'
    , '555'
    , '666'
    , 'DESC' 
INTO obj_header 
FROM DUAL;
    
SELECT NULL
    , 21
    , '27/FEB/20'
    , '27/FEB/20'
    , '141022720'
    , 600
    , 100
    , 50
    , 'ALL GOOD'
    , 1
    , '27/FEB/20'
    , '27/FEB/20'
INTO obj_activity 
FROM DUAL;

ACTIVITIES.EXTEND(2);
ACTIVITIES (1) := obj_activity;

SELECT NULL
    , 22
    , '27/FEB/20'
    , '27/FEB/20'
    , '141022720'
    , 800
    , 100
    , 50
    , 'ALL GOOD'
    , 1
    , '27/FEB/20'
    , '27/FEB/20'
INTO obj_activity 
FROM DUAL;

ACTIVITIES (2) := obj_activity;

SELECT NULL
    , 500
    , 12
    , 23
    , 34
    , 8001
    , 'GOODS'
    , 12
    , '10/FEB/20'
    , '10/FEB/20'
INTO obj_material 
FROM DUAL;

MATERIALS.EXTEND(2);
MATERIALS (1) := obj_material;

SELECT NULL
    , 500
    , 1
    , 2
    , 3
    , 800
    , 'GOODS'
    , 1
    , '10/FEB/20'
    , '10/FEB/20'
INTO obj_material 
FROM DUAL;

MATERIALS (2) := obj_material;   

SELECT NULL
    , 1
    , 1
    , '10/FEB/20'
    , '10/FEB/20'
    , 'GG'
    , 12
    , '10/FEB/20'
    , '10/FEB/20'
INTO obj_manpower 
FROM DUAL;

MANPOWER.EXTEND(2);
MANPOWER (1) := obj_manpower;

SELECT NULL
    , 12
    , 12
    , '10/FEB/20'
    , '10/FEB/20'
    , 'GGGG'
    , 122
    , '10/FEB/20'
    , '10/FEB/20'
INTO obj_manpower 
FROM DUAL;

MANPOWER (2) := obj_manpower;    

RESULT := T3_PACKAGE.STORE_ALL(
OBJ_HEADER => OBJ_HEADER
, ACTIVITIES => ACTIVITIES
, MANPOWER => MANPOWER
, MATERIALS => MATERIALS    
);
--rollback; 
END;
`;

const post = async () => {
    // const header = Object.assign({}, data);

    const result = await database.simpleExecute(qry)

    return result;
};

module.exports.post = post;