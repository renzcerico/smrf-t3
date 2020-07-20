tbl_header
* id
barcode
actual_start
actual_end
status
po_number
control_number
shipping_date
order_quantity
customer
curstomer_code
customer_spec
old_code
internal_code
product_description

tbl_activity
* id
header_id
start_time
end_time
lot_number
packed_qty
adj_qty
downtime
remarks
last_updated_by
date_entered
date_updated

tbl_material
* ID
MATERIAL_CODE
QUANTITY
STANDARD
REQUIREMENTS
USED
REJECT
REMARKS
LAST_UPDATED_BY
DATE_ENTERED
DATE_UPDATED

tbl_manpower
* id
position_id
manpower_id
from
to
remarks
last_updated_by
date_entered
date_updated

OBJ_MATERIAL.ID
,OBJ_MATERIAL.MATERIAL_CODE
,OBJ_MATERIAL.QUANTITY
,OBJ_MATERIAL.STANDARD
,OBJ_MATERIAL.REQUIREMENTS
,OBJ_MATERIAL.USED
,OBJ_MATERIAL.REJECT
,OBJ_MATERIAL.REMARKS
,OBJ_MATERIAL.LAST_UPDATED_BY
,OBJ_MATERIAL.DATE_ENTERED
,OBJ_MATERIAL.DATE_UPDATED

ID : null
,POSITION_ID : 1
,MANPOWER_ID : 1
,FROM : '29/FEB/20'
,TO : '29/FEB/20'
,REMARKS : 'REMARKS'
,LAST_UPDATED_BY : 1
,DATE_ENTERED : '29/FEB/20'
,DATE_UPDATED :'29/FEB/20'

ID: 1, QUANTITY: 500, STANDARD: 1, REQUIREMENTS: 500, USED: 500, REJECT: 0, REMARKS: 'remarks', LAST_UPDATED_BY: 1, DATE_ENTERED: '29/FEB/20', DATE_UPDATED: '29/FEB/20', MATERIAL_CODE: '1231313'