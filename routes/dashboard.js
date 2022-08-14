const express = require("express");
const router = express.Router();
const db = require("../database");
const { v4: uuidv4 } = require("uuid");

// Doooooone

// --------- GET PROJECT LIST -------------------
router.get("/project-list", function (req, res, next) {
  if (req.user.admin === true) {
    //Return all projects assigned to current user, and the users assigned to them.
    db.query(
      `SELECT distinct on (project.id)
        project.key,
        project.title,
        project.description,
        STRING_AGG ( concat(account.first_name, ' ', account.last_name), ', ' ) as assigned
          FROM project
              LEFT JOIN assignment 
                  ON project.key = assignment.project_key
              LEFT JOIN account
                  ON assignment.user_id = account.id
          GROUP BY
              project.id,
              project.title,
              project.description
          ORDER BY
              project.id DESC;`,
      (err, results) => {
        if (err) {
          return next(err);
        }
        return res.send(results.rows);
      }
    );
  } else {
    const id = req.user.id;
    // Return all projects assigned to current user, and the users assigned to them.
    db.query(
      `SELECT DISTINCT ON (project.id) 
      project.KEY,
      project.title,
      project.description,
      String_agg (Concat(account.first_name, ' ', account.last_name), ', ') AS assigned
      FROM	project
        LEFT JOIN assignment
            ON project.KEY = assignment.project_key
        LEFT JOIN account
            ON assignment.user_id = account.id
        GROUP  BY project.id,
            project.id,
            project.title,
            project.description
            HAVING $1 = ANY(ARRAY_AGG(account.id))
        ORDER  BY project.id DESC; `,
      [id],
      (err, results) => {
        if (err) {
          return next(err);
        }
        return res.send(results.rows);
      }
    );
  }
});

//------- GET PRIORITY STATS -------------

router.get("/ticket-stats/priority", function (req, res, next) {
  if (req.user.admin === true) {
    //Return ALL Ticket Stats
    db.query(
      `SELECT priority as title, cast(count(priority)as int) as value
    FROM ticket 
    GROUP by priority
    ORDER BY CASE WHEN ticket.priority = 'Urgent' THEN 1
            WHEN ticket.priority = 'High' THEN 2
            WHEN ticket.priority = 'Med' THEN 3
            WHEN ticket.priority = 'Low' THEN 4
            ELSE 4 END;`,
      (err, results) => {
        if (err) {
          return next(err);
        }
        return res.send(results.rows);
      }
    );
  } else {
    // Return Ticket Stats for User.
    db.query(
      `SELECT ticket.priority as title, cast(count(ticket.priority)as int) as value
      FROM ticket
      INNER JOIN tasks
      		on ticket.key = tasks.ticket_key
      		WHERE tasks.user_id = $1
      GROUP by ticket.priority
      ORDER BY CASE WHEN ticket.priority = 'Urgent' THEN 1
              WHEN ticket.priority = 'High' THEN 2
              WHEN ticket.priority = 'Med' THEN 3
              WHEN ticket.priority = 'Low' THEN 4
              ELSE 4 END;`,
      [req.user.id],
      (err, results) => {
        if (err) {
          return next(err);
        }
        return res.send(results.rows);
      }
    );
  }
});

//----------- GET STATUS STATS -----------------------

router.get("/ticket-stats/status", function (req, res, next) {
  if (req.user.admin === true) {
    //Return ALL Ticket Stats
    db.query(
      `SELECT status as title, cast(count(status)as int) as value
      FROM ticket 
      GROUP by status;`,
      (err, results) => {
        if (err) {
          return next(err);
        }
        return res.send(results.rows);
      }
    );
  } else {
    // Return Ticket Stats for User.
    db.query(
      `SELECT status as title, cast(count(status)as int) as value
      FROM ticket
            INNER JOIN tasks
      		on ticket.key = tasks.ticket_key
      		WHERE tasks.user_id = $1 
      GROUP by status;`,
      [req.user.id],
      (err, results) => {
        if (err) {
          return next(err);
        }
        return res.status(200).send(results.rows);
      }
    );
  }
});

//----------- GET TYPE STATS ----------------

router.get("/ticket-stats/type", function (req, res, next) {
  if (req.user.admin === true) {
    //Return ALL Ticket Stats
    db.query(
      `SELECT type as title, cast(count(type)as int) as value
      FROM ticket 
      GROUP by type;`,
      (err, results) => {
        if (err) {
          return next(err);
        }
        return res.status(200).send(results.rows);
      }
    );
  } else {
    // Return Ticket Stats for User.
    db.query(
      `SELECT type as title, cast(count(type)as int) as value
      FROM ticket
            INNER JOIN tasks
      		on ticket.key = tasks.ticket_key
      		WHERE tasks.user_id = $1 
      GROUP by type;`,
      [req.user.id],
      (err, results) => {
        if (err) {
          return next(err);
        }
        return res.status(200).send(results.rows);
      }
    );
  }
});

//------- Get Accounts For New Project Drop Down--------
router.get("/get-accounts", function (req, res, next) {
  db.query(
    `SELECT CONCAT(first_name, ' ', last_name) as label, id as value
    FROM account 
      where account.admin = false
    ORDER BY id DESC;`,
    (err, results) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(results);
    }
  );
});

//------------ Create New Project and Assign Roles Modal -----------------

router.post("/", function (req, res, next) {
  const key = uuidv4();
  const { title, description, selected } = req.body;
  db.query(
    `INSERT INTO project (key, title, description) VALUES ($1, $2, $3);`,
    [key, title, description],
    (err, results) => {
      if (err) {
        return next(err);
      }
      for (user in selected) {
        db.query(
          `INSERT INTO assignment (user_id, project_key) VALUES ($1, $2);`,
          [selected[user].value, key],
          (err, results) => {
            if (err) {
              return next(err);
            }
            return res.status(201).send("Created");
          }
        );
      }
    }
  );
});

module.exports = router;
