import fs from 'fs';
import sqlite3, { Database } from 'sqlite3';

// Constants
const DB_FILE_PATH = './tag-selector.sqlite3';
const TABLE_NAME = 'llm_system_prompts';
const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (id INTEGER PRIMARY KEY, name TEXT, prompt TEXT)`
const INSERT_DEFAULT_ROW_QUERY = `INSERT INTO ${TABLE_NAME} (name, prompt) VALUES (?, ?), ("default", "You are a helpful assistant")`

// Function that initializes and sets up the database
function initializeDatabase() {
  fs.access(DB_FILE_PATH, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('Database file does not exist. Creating...');
      const db = new sqlite3.Database(DB_FILE_PATH);
      db.run(CREATE_TABLE_QUERY, createTable(db));
    }
  });
}

// Function for creating the table
function createTable(db: Database) {
  return (err: any) => {
    if (err) {
      console.error('Error creating table:', err);
      db.close();
    } else {
      console.log('Table created.');
      db.run(INSERT_DEFAULT_ROW_QUERY, insertDefaultRowAndCloseDatabase(db));
    }
  };
}

// Function for inserting the default row and closing the database
function insertDefaultRowAndCloseDatabase(db: Database) {
  return (err: any) => {
    if (err) {
      console.error('Error inserting default row:', err);
    } else {
      console.log('Default row inserted.');
    }
    db.close();
  };
}

// Call the function to actually initialize the database
initializeDatabase();