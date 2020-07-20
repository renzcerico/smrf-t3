const header = require('../../db_apis/t3/header.js');

const post = async (req, res, next) => {
    try {
        data = {
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            shipping_date: req.body.shipping_date,
            status: req.body.status,
            po_number: req.body.po_number,
            control_number: req.body.control_number,
            order_qty: req.body.order_qty,
            customer: req.body.customer,
            customer_code: req.body.customer_code,
            customer_specs: req.body.customer_specs,
            old_code: req.body.old_code,
            internal_code: req.body.internal_code,
            product_desc: req.body.product_desc
        };

        const rows = await header.post();
        res.status(200).end(rows);
    } catch (err) {
        next(err);
    }
};

module.exports.post = post;