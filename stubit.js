#!/usr/bin/env node
var inquirer = require("inquirer");
var hogan = require("hogan");
var fs = require("fs");
var path = require("path");
var minimatch = require("minimatch");

if (process.argv.length > 2) {
  for (var i = 2; i < process.argv.length; i++) {
    if (process.argv[i].indexOf("help") > -1) {
      console.log("Stubit - the almost stupid stubbing/scaffolding tool.");
      console.log();
      console.log("Allows you to quickly create a new project from a predefined template.")
      console.log("For instructions on how to create new templates see https://github.com/rhmoller/stubit");
      console.log();
      console.log("Usage:");
      console.log("  stubit");
      console.log("    starts an interactive command line tool for creating a new project");
      process.exit();
    }
  }
  console.log("stubit currently ignores command line parameters.")
  console.log();
}


var templates = fs.readdirSync(__dirname + "/templates");

var envValue = process.env.STUBIT_TEMPLATES;
if (process.env.STUBIT_TEMPLATES && fs.existsSync(envValue)) {
  templates = fs.readdirSync(envValue);
}

var questions = [
  {
    type: "input",
    name: "name",
    message: "Create new project in folder"
  },
  {
    type: "rawlist",
    name: "template",
    message: "Project template",
    choices: templates
  }
];

var copyRecursiveSync = function(src, dest, context, matchers, basePos) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName),
                        context, matchers, basePos);
    });
  } else {
    if (!minimatch(src, "**/stubit.json")) {
      var isTemplate = false;
      if (matchers) {
        for (var i = 0; i < matchers.length; i++) {
          if (minimatch(src.substr(basePos), matchers[i])) {
            isTemplate = true;
            break;
          }
        }
      }
      if (isTemplate) {
        var data = fs.readFileSync(src).toString();
        var template = hogan.compile(data);
        var result = template.render(context);
        fs.writeFileSync(dest, result);
      } else {
        var data = fs.readFileSync(src).toString();
        fs.writeFileSync(dest, data);
      }
    }
  }
};

inquirer.prompt(questions, function (answers) {
  console.log("Creating project " + answers.name + " from template " + answers.template + "...");

  var srcDir = __dirname + "/templates/" + answers.template;
  var hasStubFile = fs.existsSync(srcDir + "/stubit.json" );

  if (hasStubFile) {
    var stub = fs.readFileSync(srcDir + "/stubit.json").toString();
    var json = JSON.parse(stub);

    var tgtDir = answers.name;
    var extraQuestions = json.questions;
    var templateMatcher = json.templates;
    var basePos = srcDir.length + 1;

    if (extraQuestions) {
      inquirer.prompt(extraQuestions, function (extraAnswers) {
        answers.x = extraAnswers;
        copyRecursiveSync(srcDir, tgtDir, answers, templateMatcher, basePos);
        console.log("Done");
      });
    } else {
      copyRecursiveSync(srcDir, tgtDir, answers, templateMatcher, basePos);
      console.log("Done");
    }

  }

});
