const express = require('express');
const router = new express.Router();
const login = require('../controllers/logins.js');
const personnel = require('../controllers/personnel.js');
const session = require('../controllers/session.js');
const request = require('../controllers/request.js');

const serviceRepresentative = require('../controllers/service_representative.js');
const department = require('../controllers/department.js');
const requestList = require('../controllers/list_of_request.js');
const user = require('../controllers/user.js');
const job = require('../controllers/job.js');
const services = require('../controllers/services.js');

router.route('/login')
  .post(login.post);

router.route('/logout')
  .get(login.logout);

router.route('/approver/:id')
  .get(personnel.getApprover);

  router.route('/personnel/:search?')
  .get(personnel.get);

router.route('/session')
  .get(session.get);
  
router.route('/requests/:request_id?')
  .post(request.request);
  
router.route('/service-representatives')
  .get(serviceRepresentative.get);

router.route('/departments')
  .get(department.get);

router.route('/request-list')
  .post(requestList.post);

router.route('/user')
  .post(user.post);

router.route('/requests')
  .get(request.getAllRequest);

router.route('/requests/user/:id')
  .get(request.getAllRequestById);

router.route('/requests/:id')
  .get(request.getRequestById);

router.route('/request-details/:id')
  .post(request.updateRequest);

router.route('/request/details/:id')
  .post(request.updateRequestDetails);

router.route('/request/transfer')
  .post(request.transfer);

router.route('/completed')
  .post(job.completed);

router.route('/jobs')
  .post(job.create);

router.route('/jobs/user/:id')
  .get(job.getAllJobsById);

router.route('/jobs')
  .get(job.getAllJobs);

router.route('/jobs/:id')
  .get(job.getJob);

router.route('/users/dept/:id')
  .get(personnel.getAllUser);

router.route('/dept/chief/:id')
  .get(personnel.getChiefByDept);

router.route('/uploads/appui/:img')
  .get(request.getImage);

router.route('/users')
  .get(user.getAllUser);

router.route('/users/delete/:id')
  .post(user.deleteUser);

router.route('/departments')
  .post(department.insert)

router.route('/services')
  .get(services.get);

module.exports = router;