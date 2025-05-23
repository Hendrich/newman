---- install newman----
npm install -g newman

----- running newman --------
newman run <path_to_your_collection.json> -e <path_to_your_environment.json> --reporters csv --reporter-csv-export <path_to_save_report.csv>

----- running script node.js ------
node script.js