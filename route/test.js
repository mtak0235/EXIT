const { PythonShell } = require("python-shell");
    PythonShell.run("./bmw_classifier.py", null, function(err) {
    if (err) throw err;
    console.log("finished");
    });
