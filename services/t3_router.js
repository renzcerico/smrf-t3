const express = require('express');
const t3_router = new express.Router();
const login = require('../controllers/t3/logins.js');
const personnel = require('../controllers/t3/personnel.js');
const header = require('../controllers/t3/header.js');
const t3 = require('../controllers/t3/t3.js');
const accounts = require('../controllers/t3/accounts.js');

t3_router.route('/header')
  .post(header.post);

t3_router.route('/login')
  .post(login.post);

t3_router.route('/personnel/:search?')
  .get(personnel.get);

t3_router.route('/store_all').post(t3.storeAll);

t3_router.route('/get_all_by_barcode/:barcode').get(t3.getAllByBarcode);

t3_router.route('/get_downtime_types').get(t3.getDowntimeTypes);

t3_router.route('/accounts')
  .post(accounts.insert);

t3_router.route('/get-all-accounts')
  .post(accounts.all);

t3_router.route('/accounts/:id')
  .get(accounts.getById);

t3_router.route('/get-manpower-list').get(accounts.getManpowerList);

t3_router.route('/get_header_count_per_status').get(t3.getHeaderCountPerStatus);

t3_router.route('/get_header_by_status').post(t3.getHeaderByStatus);

t3_router.route('/accounts/reset')
  .post(accounts.resetPassword);

t3_router.route('/auth')
  .get(login.authenticate);

t3_router.route('/logout')
  .get(login.logout);

t3_router.route('/forward-list')
  .get(login.forwardList);

t3_router.route('/set-user')
  .get(login.setUser);

t3_router.route('/get-server-time')
  .get(t3.getServerTime);

t3_router.route('/get-all-positions')
.get(t3.getAllPositions);

t3_router.route('/change-password')
  .post(t3.changePassword);

t3_router.route('/t3Batch_info/:barcode')
  .get(t3.get);

t3_router.route('/create-downtime-types')
.post(t3.createDowntimeTypes);

module.exports = t3_router;