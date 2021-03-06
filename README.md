# stubit

The almost stupid stubbing/scaffolding tool.

# Install

With [npm](http://npmjs.org) do:

```
npm install -g stubit
```

# Usage

```
stubit
```

Stubit will look for the environment variable STUBIT_TEMPLATES. This variable
should contain the path to a folder containing your project templates.

If it is not defined stubit will use the templates folder from the distribution.

Stubit will ask you for the name of project folder it should create.
Then it will ask you to pick which template to use.
The template can optionally define a number of parameters, that the user can adjust
through a nice command line interface. This parameters will be substitued into
the project template files.

# Creating a new project template

A template is simply a folder below the templates folder containing all the files
required for a project of the given type. This makes it dead simple to create a
new template.

An optional stubit.json file can be placed in the root of a template, if it needs
to substitute values into any of the project files.


# Defining additional questions

```
{
  "questions": [
    {
      "name": "version",
      "type": "input",
      "message": "Version number",
      "default": "0.0.1"
    }
  ],
}
```

Questions are specified using [inquirer](https://github.com/SBoudrias/Inquirer.js) syntax.

# Template file filter

Specify filter for files that should be treated as [mustache](https://mustache.github.io) templates.

```
{
  "templates": [
    "package.json",
    "assets/index.html"
  ]
}
```

Filters are specified using glob syntax. See [minimatch](https://github.com/isaacs/minimatch).

The answers from the template specific questions are placed in an object called x

So to read the version specified in the above example you should use

```
  The version number is {{x.version}}
```

# More advanced templates

Stubit does not support conditional copying of files or dynamically generated files. If you need
this, you should take a look at [Yeoman Yo](http://yeoman.io) instead.
