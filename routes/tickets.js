const express = require("express");
const router = express.Router();
const db = require("../database");

//Dooooooone

//---------- Tickets Page Verbose List --------------
router.get("/", function (req, res, next) {
  if (req.user.admin) {
    //Returns all tickets to the admin
    db.query(
      `SELECT project.title as project,
      ticket.title as ticket,
      ticket.description,
      ticket.type, ticket.status, ticket.priority,
      ticket.created,
      ticket.project_key,
      ticket.key as ticket_key
      FROM ticket
      INNER JOIN project ON project.key = ticket.project_key
      INNER JOIN account ON account.id = ticket.author
      ORDER BY CASE WHEN ticket.priority = 'Urgent' THEN 1
        WHEN ticket.priority = 'High' THEN 2
        WHEN ticket.priority = 'Med' THEN 3
        WHEN ticket.priority = 'Low' THEN 4
        ELSE 4 END, ticket.created;`,
      (err, results) => {
        if (err) {
          return next(err);
        }
        res.status(200).send(results.rows);
        return next();
      }
    );
  } else {
    // Returns tickets for current user that arent completed.
    db.query(
      `SELECT 		
      project.title as project,
      ticket.title as ticket,
      ticket.description,
      ticket.type, ticket.status, ticket.priority,
      ticket.created,
      ticket.project_key,
      ticket.key as ticket_key
        FROM ticket
        INNER JOIN tasks ON tasks.ticket_key = ticket.key
        INNER JOIN project ON project.key = ticket.project_key
         WHERE tasks.user_id = $1 AND ticket.status != 'Completed'
        ORDER BY CASE WHEN ticket.priority = 'Urgent' THEN 1
                  WHEN ticket.priority = 'High' THEN 2
                  WHEN ticket.priority = 'Med' THEN 3
                  WHEN ticket.priority = 'Low' THEN 4
                  ELSE 4 END, ticket.created;`,
      [req.user_id],
      (err, results) => {
        if (err) {
          return next(err);
        }
        res.status(200).send(results.rows);
        return next();
      }
    );
  }
});
module.exports = router;
