const express = require("express");
const router = express.Router();
const db = require("../database");
const { v4: uuidv4 } = require("uuid");

router.get("/info/:projectID", function (req, res, next) {
  //Returns Project Info
  db.query(
    `SELECT project.title, project.description FROM project WHERE project.key = $1;`,
    [req.params.projectID],
    (err, results) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(results.rows[0]);
    }
  );
});

////////////////////////////////
///////// TEAMS COMPONENT //////
////////////////////////////////

router.get("/:projectID/assigned", function (req, res, next) {
  //Returns All Team Members Assigned To ProjectID
  db.query(
    `SELECT 
	account.id,
	Concat(account.first_name, ' ', account.last_name) as name,
  account.email
    FROM account
        Inner JOIN assignment
            ON account.id = assignment.user_id
        LEFT JOIN project
            ON assignment.project_key = project.key
        WHERE project.key = $1
    GROUP BY account.id,
        account.first_name;`,
    [req.params.projectID],
    (err, results) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(results.rows);
    }
  );
});

//------- Returns Team Members Not Assigned to Project Project Drop Down--------
router.get("/:projectID/available", function (req, res, next) {
  db.query(
    `SELECT distinct on (account.id)
      CONCAT(account.first_name, ' ', account.last_name) as label, account.id as value, CONCAT(account.first_name, ' ', account.last_name) as name, account.id as id, account.email
        FROM account
        WHERE account.id NOT IN (SELECT distinct on (account.id)
        account.id
              FROM account
                  LEFT JOIN assignment 
                      ON account.id = assignment.user_id
              WHERE assignment.project_key = $1
              GROUP BY
                  account.id);`,
    [req.params.projectID],
    (err, results) => {
      if (err) {
        return next(err);
      }
      console.log(results);
      return res.status(200).send(results);
    }
  );
});

//------------ INSERT New User To assignment -----------------
router.post("/:projectID/add", function (req, res, next) {
  const users = req.body.selected;
  for (user in users) {
    db.query(
      `INSERT INTO assignment (user_id, project_key) VALUES ($1, $2);`,
      [users[user].value, req.params.projectID],
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  }
  return res.status(201).send("Created");
});

//
router.delete("/:projectID/delete-member/:user_id", function (req, res, next) {
  if (req.user.admin) {
    db.query(
      `DELETE FROM assignment
        where user_id = $1 AND project_key = $2;`,
      [req.params.user_id, req.params.projectID],
      (err, results) => {
        if (err) {
          return next(err);
        }
        return res.status(200).send("Removed");
      }
    );
  }
});

////////////////////////////////
///////// TICKETS COMPONENT ///
///////////////////////////////

router.get("/:projectID/tickets", function (req, res, next) {
  //Tickets
  db.query(
    `SELECT 
	ticket.key as ticket_key,
  ticket.project_key as project_key,
	ticket.title as ticket,
	ticket.description,
	ticket.priority,
  ticket.status,
	Concat(account.first_name, ' ', account.last_name) as author,
  ticket.created
    FROM ticket
        Inner JOIN account
            ON account.id = ticket.author
        WHERE ticket.project_key = $1
    GROUP  BY
        ticket.id,
        ticket.title,
        ticket.description,
        ticket.priority,
        Concat(account.first_name, ' ', account.last_name),
        ticket.created
    ORDER BY CASE
        WHEN ticket.priority = 'Urgent' THEN 1
        WHEN ticket.priority = 'High' THEN 2
        WHEN ticket.priority = 'Med' THEN 3
        WHEN ticket.priority = 'Low' THEN 4
                    ELSE 4 END, ticket.created;`,
    [req.params.projectID],
    (err, results) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(results.rows);
    }
  );
});

//DONE PROBABLY
//------------ Create New Ticket and Assign Tasks Modal -----------------

router.get("/:projectID/new-ticket-available", function (req, res, next) {
  //Returns All Team Members Assigned To ProjectID
  db.query(
    `SELECT 
	account.id as value,
	Concat(account.first_name, ' ', account.last_name) as label
    FROM account
        Inner JOIN assignment
            ON account.id = assignment.user_id
        LEFT JOIN project
            ON assignment.project_key = project.key
        WHERE project.key = $1
    GROUP BY account.id,
        account.first_name;`,
    [req.params.projectID],
    (err, results) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(results.rows);
    }
  );
});

router.post("/new-ticket/:projectID", function (req, res, next) {
  const project_key = req.params.projectID;
  const author = req.user.id;
  const key = uuidv4();
  const { title, description, priority, type, selected } = req.body;
  db.query(
    `INSERT INTO ticket (key, project_key, title, description, priority, type, author) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [key, project_key, title, description, priority, type, author],
    (err) => {
      if (err) {
        return next(err);
      }
      for (user in selected) {
        db.query(
          `INSERT INTO tasks (user_id, ticket_key) VALUES ($1, $2);`,
          [selected[user].value, key],
          (err) => {
            if (err) {
              return next(err);
            }
          }
        );
      }
    }
  );
  return res.status(201).send(key);
});

////////////////////////////////
/// TICKET MORE INFO COMP /////
///////////////////////////////

router.get("/ticket-info/:ticketID", function (req, res, next) {
  //Ticket Information
  db.query(
    `SELECT
    ticket.title as ticket,
    ticket.description,
    CONCAT(account.first_name,' ',account.last_name) as author,
    ticket.type, ticket.status, ticket.priority,
    ticket.created,
    ticket.key as ticket_key
    FROM ticket
    INNER JOIN account ON account.id = ticket.author
    WHERE ticket.key = $1
    ORDER BY CASE WHEN ticket.priority = 'Urgent' THEN 1
      WHEN ticket.priority = 'High' THEN 2
      WHEN ticket.priority = 'Med' THEN 3
      WHEN ticket.priority = 'Low' THEN 4
      ELSE 4 END, ticket.created; `,
    [req.params.ticketID],
    (err, results) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(results.rows);
    }
  );
});

router.get("/assigned-devs/:ticketID", function (req, res, next) {
  //Ticket Information
  db.query(
    `SELECT 
    ticket.key,
    Concat(account.first_name, ' ', account.last_name) as name,
    account.email
      FROM account
          Inner JOIN tasks
              ON account.id = tasks.user_id
          LEFT JOIN ticket
              ON tasks.ticket_key = ticket.key
          WHERE ticket.key = $1
      GROUP BY ticket.key, name, account.email;`,
    [req.params.ticketID],
    (err, results) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(results.rows);
    }
  );
});

//update ticket with information
router.put("/update-ticket/:ticketID", function (req, res, next) {
  const { status, priority, type } = req.body;
  db.query(
    `UPDATE ticket
    SET status = $1,
        priority = $2,
        type = $3
    WHERE ticket.key = $4;`,
    [status, priority, type, req.params.ticketID],
    (err, results) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(results.rows);
    }
  );
});

//get comments for ticket
router.get("/get-comments/:ticketID", function (req, res, next) {
  //Ticket Information
  db.query(
    `SELECT 
    comment.id,
    comment.author,
    Concat(account.first_name, ' ', account.last_name) as name,
    comment.ticket_key,
    comment.comment,
    comment.posted
    
      FROM comment
          Inner JOIN account
              ON account.id = comment.author
          WHERE comment.ticket_key = $1
      GROUP BY comment.id, account.first_name, account.last_name
      ORDER BY comment.posted DESC;`,
    [req.params.ticketID],
    (err, results) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(results.rows);
    }
  );
});

//get comments for ticket
router.post("/post-comment/:ticketID", function (req, res, next) {
  const author = req.user.id;
  console.log(req.body);
  const post = req.body.post;
  //Ticket Information
  db.query(
    `INSERT INTO comment (author, ticket_key, comment)
    VALUES ($1, $2, $3);`,
    [author, req.params.ticketID, post],
    (err, results) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send("comment posted");
    }
  );
});

module.exports = router;
