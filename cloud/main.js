
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

var ProjectClassName = "Project";
var Project = Parse.Object.extend(ProjectClassName);
var MemberClassName = "Member";
var Member = Parse.Object.extend(MemberClassName);
var UserRoleClassName = "UserRole";
var UserRole = Parse.Object.extend(UserRoleClassName);
var TeamClassName = "Team";
var Team = Parse.Object.extend(TeamClassName);

Parse.Cloud.beforeSave(ProjectClassName, function(request, response) {
  if (!request.object.get("title") || request.object.get('title').trim() == '') {
    response.error('A project must have a title.');
  } else {
    var query = new Parse.Query(Project);
    query.equalTo("title", request.object.get("title"));
    query.notEqualTo("objectId", request.object.id || null);
    query.find({
      success: function(object) {
        if (object.length) {
          response.error("A project with same title is already existed.");
        } else {
          response.success();
        }
      },
      error: function(error) {
        response.error(error.message);
      }
    });
  }
});

Parse.Cloud.beforeSave(MemberClassName, function(request, response) {
  if (!request.object.get("username") || request.object.get('username').trim() == '') {
    response.error('A member must have a username.');
  } else if(!request.object.get('password') || request.object.get('password').trim() == '') {
    response.error('A member must have a password.');
  } else if(!request.object.get("fullName") || request.object.get('fullName').trim() == '') {
    response.error('A member must have a full name.');
  } else {
    var query = new Parse.Query(Member);
    query.equalTo("username", request.object.get("username"));
    query.notEqualTo("objectId", request.object.id || null);
    query.find({
      success: function(object) {
        if (object.length) {
          response.error("A member with same username is already existed.");
        } else {
          response.success();
        }
      },
      error: function(error) {
        response.error(error.message);
      }
    });
  }
});

Parse.Cloud.beforeSave(UserRoleClassName, function(request, response) {
  if (!request.object.get("name") || request.object.get('name').trim() == '') {
    response.error('A role must have a name.');
  } else {
    var query = new Parse.Query(UserRole);
    query.equalTo("name", request.object.get("name"));
    query.notEqualTo("objectId", request.object.id || null);
    query.find({
      success: function(object) {
         for(k in object) { console.log(object[k].get('name')); }
        if (object.length) {
          response.error("A role with same name is already existed.");
        } else {
          response.success();
        }
      },
      error: function(error) {
        response.error(error.message);
      }
    });
  }
});

Parse.Cloud.beforeSave(TeamClassName, function(request, response) {
  if (!request.object.get("name") || request.object.get('name').trim() == '') {
    response.error('A team must have a name.');
  } else {
    var query = new Parse.Query(Team);
    query.equalTo("name", request.object.get("name"));
    query.notEqualTo("objectId", request.object.id || null);
    query.find({
      success: function(object) {
        if (object.length) {
          response.error("A team with same name is already existed.");
        } else {
          response.success();
        }
      },
      error: function(error) {
        response.error(error.message);
      }
    });
  }
});

Parse.Cloud.afterDelete(TeamClassName, function(request) {

  // after delete a student find the associated sessions and remove
  var query = new Parse.Query(MemberClassName);
    var team = {
      __type: 'Pointer',
      className: TeamClassName,
      objectId: request.object.id
    }
  query.equalTo("team", team);

  query.find().then(function(results) {
    return Parse.Object.destroyAll(results);
  }).then(function(success) {
    
  }, function(error) {
    console.error(error.message);
  });
});
