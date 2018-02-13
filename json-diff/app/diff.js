function requestHandler(request, response) {

  const changesets = require('diff-json');

  const obj0 = {
    catalogueNumber: '123',
    country: "Swed.",
    collector: "Zacharias Zettersröm",
    individualCount: 2,
    _editor: "Alfons Ahlström",
    _editTime: "2018-01-02",
    _source: "label"
  };

  const obj1 = {
    catalogueNumber: '123',
    country: "Sweden",
    collector: "Zacharias Zettersröm",
    individualCount: 2,
    locality: "Stockholm, Frescati",
    date: "2899-05-15",
    _editor: "Bertil Bergholm",
    _editTime: "2018-01-10",
    _source: "notebook"
  };
    
  const obj2 = {
    catalogueNumber: '123',
    country: "Sweden",
    collector: "Zacharias Zettersröm",
    individualCount: 2,
    locality: "Stockholm, Frescati",
    date: "1899-05-15",
    _editor: "Cecilia Cederholm",
    _editTime: "2018-01-11",
    _source: "fix"
  };
    
  const obj3 = {
    catalogueNumber: '123',
    country: "Sweden",
    collector: "Zacharias Zettersröm",
    locality: "Stockholm, Frescati",
    date: "1899-05-15",
    lengthInMillimeters: [250],
    weightInGrams: [100],
    _editor: "David Danielsson",
    _editTime: "2018-02-10",
    _source: "new research"
  };

// Change history

  response.write("SPECIMEN HISTORY:\n\n");

  response.write("Specimen added by " + obj0._editor + " on " + obj0._editTime + "\n\n");
  handleDiffs(obj0, obj1);
  handleDiffs(obj1, obj2);
  handleDiffs(obj2, obj3);

  function handleDiffs(oldObj, newObj) {
    diffs = changesets.diff(oldObj, newObj);
    logDiffs(diffs);
  }

  function logDiffs(diffs) {
    let html = "";
    let _editor = "";
    let _editTime = "";
    let _source = "";

    // Get _editor and _editTime
    diffs.forEach(function parseElement(element) {
//      console.log(element);

      if ("_editor" == element.key) {
        _editor = element.value;
      }
      else if ("_editTime" == element.key) {
        _editTime = element.value;
      }
      else if ("_source" == element.key) {
        _source = element.value;
      }
    });

    diffs.forEach(function parseElement(element) {
      if ("_editor" == element.key || "_editTime" == element.key || "_source" == element.key) {
        // skip
      }
      else if ("add" == element.type) {
        html = html + element.key + " added with value '" + element.value + "' by " + _editor + " on " + _editTime + " (" + _source + ")\n";
      }
      else if ("update" == element.type) {
        html = html + element.key + " changed from old value '" + element.oldValue + "' to '" + element.value + "' by " + _editor + " on " + _editTime + " (" + _source + ")\n";
      }
      else if ("remove" == element.type) {
        html = html + element.key + " removed with old value '" + element.value + "' by " + _editor + " on " + _editTime + " (" + _source + ")\n";
      }
    });

    response.write(html + "\n");
  }

  // Provenance

  // Get values from first object
  let cObj = {};
  for (let prop in obj0) {
    let temp = {};
    temp.value = obj0[prop];
    temp.source = "   by " + obj0._editor + " on " + obj0._editTime + " (" + obj0._source + ")";
    cObj[prop] = temp;
  }

  // Update values based on new objects
  cObj = updateSourceData(cObj, obj1);
  cObj = updateSourceData(cObj, obj2);
  cObj = updateSourceData(cObj, obj3);

  function updateSourceData(cObj, obj1) {

    for (let prop in obj1) {

      // Add new value if old does not exist, or is different from new
      if (!cObj.hasOwnProperty(prop) || obj1[prop] != cObj[prop]["value"]) {
        let temp = {};
        temp.value = obj1[prop];
        temp.source = "   by " + obj1._editor + " on " + obj1._editTime + " (" + obj1._source + ")";
        cObj[prop] = temp;
      }

    }
    return cObj;
  } 
  
  // Remove keys not present in latest obj
  for (let prop in cObj) {
    if (!obj3.hasOwnProperty(prop)) {
      delete cObj[prop];
    }
  }

  // Write 
  response.write("\nCURRENT DATA: \n\n");
  for (let prop in cObj) {
    if (prop.substring(0, 1) != "_") {
      response.write(prop + ": " + cObj[prop]['value'] + cObj[prop]['source']);
      response.write("\n");  
    }
  }
  

  console.log(cObj);


/*
  let changeObj = obj0;
  for (let prop in changeObj) {
    changeObj[prop] = changeObj[prop] + " (" + changeObj._editor + " on " + changeObj._editTime + " (" + changeObj._source + "))";
  }

  for (let prop in obj1) {
    console.log("prop: " + prop);
    if (extractRealValue(changeObj[prop]) != extractRealValue(obj1.prop)) {
      changeObj[prop] = obj1[prop] + " (" + obj1._editor + " on " + obj1._editTime + " (" + obj1._source + "))";
    }
  }

  function extractRealValue(str) {
    return str.substring(0, str.indexOf("("));
  }

  console.log(changeObj);
*/
  console.log("--- RAW DIFFS: ---");
  console.log(diffs);

  console.log("-------------------------------------");
  response.end("\n\n\nDONE");

}


module.exports = {
  "requestHandler" : requestHandler
};

/*
  oldObj = {
    catalogueNumber: '123',
    country: "Swed.",
    individualCount: 2,
    lengthInMillimeters: [250, 255],
    determinations: [
      {id: 'det-001', taxon: "Anas acuta"},
      {id: 'det-002', taxon: "Bucepala clangula"}
    ],
    _editor: "Alfons Ahlström",
    _editTime: "2018-01-02"
  };

  // Assume children is an array of child object and the child object has 'name' as its primary key
  diffs = changesets.diff(oldObj, newObj, {determinations: 'id'});
*/

