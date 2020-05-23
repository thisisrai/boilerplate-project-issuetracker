/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var Schema = mongoose.Schema;

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(data => console.log('connected to mongodb!'))
  .catch(error => console.log('there was an error!', error));

let issueSchema = new Schema({
  project: {
    type: String,
  },
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
  },
  updated_on: {
    type: Date,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
  },
  status_text: {
    type: String,
  },
  open: {
    type: Boolean,
  },
})

let Issue = mongoose.model('Issue', issueSchema)

module.exports = function (app, db) {

  app.route('/api/issues/:project')

    .get(function (req, res){
      var project = req.params.project;

      let findObj = {};
      var {_id, issue_title, issue_text, created_by, assigned_to, status_text, open} = req.query;

      findObj.project = project
      _id && issue_title.length !== 0 ? findObj._id = _id : findObj
      issue_title && issue_title.length !== 0 ? findObj.issue_title = issue_title : findObj
      issue_text && issue_text.length !== 0 ? findObj.issue_text = issue_text : findObj
      created_by && created_by.length !== 0 ? findObj.created_by = created_by : findObj
      assigned_to && assigned_to.length !== 0 ? findObj.assigned_to = assigned_to : findObj
      status_text && status_text.length !== 0 ? findObj.status_text = status_text : findObj
      open && open == "false" ? findObj.open = false : findObj
      open && open == "true" ? findObj.open = true : findObj

      Issue.find(findObj, function(err, result) {
        if (!err) {
          res.send(result)
        }
        else {
          res.send(err)
        }
      });
    })

    .post(function (req, res){
      let project = req.params.project;
      let {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;

      if (issue_title == undefined || issue_text == undefined || created_by == undefined) {
        return res.status(422).send('Missing Parameters')
      }

      let newIssue = new Issue({
        project: project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        open: true,
      })

      newIssue.save((err, result) => {
        if (err) res.send({"Error": err})
        res.send(result)
      })
    })

    .put(function (req, res){

      if (Object.keys(req.body).length === 0) {
        return res.status(422).send('No Request Body')
      }

      let project = req.params.project;
      let {_id, issue_title, issue_text, created_by, assigned_to, status_text, open} = req.body;
      let updateObj = {};

      issue_title && issue_title.length !== 0 ? updateObj.issue_title = issue_title : updateObj
      issue_text && issue_text.length !== 0 ? updateObj.issue_text = issue_text : updateObj
      created_by && created_by.length !== 0 ? updateObj.created_by = created_by : updateObj
      assigned_to && assigned_to.length !== 0 ? updateObj.assigned_to = assigned_to : updateObj
      status_text && status_text.length !== 0 ? updateObj.status_text = status_text : updateObj
      open && open == "false" ? updateObj.open = false : updateObj

      updateObj.updated_on = new Date()

      Issue.findOneAndUpdate({_id: _id}, updateObj, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(_id);
        }
      });

    })

    .delete(function (req, res){
      var project = req.params.project;
      let {_id} = req.body;

      if (!_id) {
        res.status(422).send('No id')
      }

      Issue.findByIdAndRemove(_id, function (err, issue) {
        if (err) return res.status(500).send(err);
        return res.status(200).send(_id);
      });

    });

};
