const { PythonShell } = require("python-shell");
let options = {
    mode: 'text',
    pythonPath: 'C:/Users/PC/Miniconda3/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: ''
  };

PythonShell.run('./bmw_classifier.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
  });
