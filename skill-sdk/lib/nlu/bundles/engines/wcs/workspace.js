/*
© Copyright IBM Corp. 2017
*/


'use strict';

const	watson = require('watson-developer-cloud');
const hash = require('object-hash');
const logger = require('../../../../logger');

var Workspace = function(credentials) {

  let options = JSON.parse(JSON.stringify(credentials));
  // options.url = "https://gateway-fra.watsonplatform.net/conversation/api/";

  try {
      this.wcs = watson.conversation(options);
  } catch (error) {
      logger.error("ERROR " +
          "module = wcs/workspace.js, " +
          "function = Workspace, " +
          "credentials = " + JSON.stringify(credentials) + ", " +
          "error = there was an error while trying to connect to WCS: " + error);
  }
};

/**
 * Process input text and extract intent and entities.
 */
Workspace.prototype.process = function(text, cb) {
  // Converse, get intent and entities
  this.wcs.message({
    workspace_id: this.workspaceId,
    input: {
      text: text
    }
  }, (err, result) => {
    if (err) {
      logger.error(err);
      // Error occured, response with empty repsponse.
      result = {
        say: null,
        intents: [],
        parameters: {}
      };
    }
    cb(err, result);
  });
};

/**
 * Bind conversation workspace. Search for workspace by name. When calling
 * the bind function we assume that the workspace exists in the service.
 */
Workspace.prototype.bind = function(name, cb) {
  this.listWorkspaces().then(result => {
    const workspace = result.workspaces.find(workspace => workspace.name === name);
    if (workspace) {
      this.workspaceId = workspace.workspace_id;
      cb();
    } else {
      cb(`Failed to load workspace ${name} or doesn't exist`);
    }
  }).catch(err => {
    logger.error('Failed to list wcs workspaces (check username / password)');
    cb('Failed to list wcs workspaces');
  });
};

/**
 * Create new workspace based on the training data content. If a workspace with
 * same content exists, we bind to it.
 * Before new workspace created, the previous workspace is being deleted.
 */
Workspace.prototype.create = function(content, cb) {
  this.listWorkspaces().then(result => {
    if (result) {
      const md5 = hash.MD5(content);
      // Check if workspace is already loaded.
      const workspace = result.workspaces.filter(workspace => {
        return workspace.metadata && (workspace.metadata.md5 === md5);
      });
      // If workspace doesn't exist (/match) delete older versions
      if (workspace.length === 0) {
        let promises = [];
        result.workspaces.forEach(workspace => {
          if (workspace.name === content.name) {
            promises.push(this.deleteWorkspace(workspace.workspace_id));
          }
        });
        // Delete all workspaces with matching name
        return Promise.all(promises);
      } else {
        // Workspace already exists, use it.
        return Promise.resolve({workspace_id: workspace[0].workspace_id});
      }
    }
  }).then(result => {
    if (result.workspace_id) {
      // Workspace exists
      return Promise.resolve(result);
    } else {
      // Create new worksapce
      return this.createWorkspace(content);
    }
  }).then(result => {
    this.workspaceId = result.workspace_id;
    cb();
  }).catch(err => {
    cb(err);
  });
};

/**
 * Promise to create watson conversation service. The function also adds md5
 * hash of the content to the metadata.
 */
Workspace.prototype.createWorkspace = function(content) {
  return new Promise((resolve, reject) => {
    // Add hash value for content uniqueness
    content.metadata = {md5: hash.MD5(content)};
    this.wcs.createWorkspace(content, (err, result) => {
      if (err) {
        reject();
      } else {
        logger.debug(`Create wcs workspace ${content.name}`);
        resolve(result);
      }
    });
  });
};

/**
 * Promise to delete a watson conversation workspace based on workspace id
 */
Workspace.prototype.deleteWorkspace = function(id) {
  return new Promise((resolve, reject) => {
    this.wcs.deleteWorkspace({workspace_id: id}, (err, result) => {
      if (err) {
        console.log(err);
        reject();
      } else {
        logger.debug(`Delete wcs workspace ${id}`);
        resolve(result);
      }
    });
  });
};

/**
 * Promise to list all watson conversation workspaces.
 */
Workspace.prototype.listWorkspaces = function() {
  return new Promise((resolve, reject) => {
    this.wcs.listWorkspaces({}, (err, result) => {
      if (err) {
        reject();
      } else {
        resolve(result);
      }
    });
  });
};


module.exports = Workspace;
