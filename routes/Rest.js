export function registerRest(app, localStorage) {
  if (!localStorage.getItem("cities")) {
    localStorage.setItem(
      "cities",
      JSON.stringify([
        {
          id: 1,
          created_at: "2023-02-06 12:31:04.882055+00",
          name: "Albuquerque",
        },
        { id: 2, created_at: "2023-02-06 12:31:37+00", name: "LA" },
        { id: 3, created_at: "2023-02-06 12:31:19+00", name: "Texas" },
      ])
    );
  }
  app.get("/:dbName", (req, res) => {
    let dbName = req.params.dbName;
    let fromLS = JSON.parse(localStorage.getItem(dbName));
    let result;
    let queryLength = Object.keys(req.query).length;

    if ((req.query.select === "*" && queryLength === 1) || queryLength === 0)
      result = fromLS;
    else if (queryLength >= 1) {
      for (let i = 0; i < queryLength; i++) {
        let key = Object.keys(req.query)[i];
        let value = req.query[key];
        let searchingValue = value.split(".")[1];
        // console.log("1: ", fromLS);
        if (Object.values(req.query)[i].includes("eq")) {
          fromLS = fromLS.filter(
            (item) => item[key.toString()] === searchingValue.toString()
          );
        } else if (Object.values(req.query)[i].includes("gt")) {
          fromLS = fromLS.filter((item) => item[key] > searchingValue);
        }
        result = fromLS;
      }
    }

    return res.status(200).send(result);
  });
  app.post("/:dbName", (req, res) => {
    let dbName = req.params.dbName;
    let fromLS = JSON.parse(localStorage.getItem(dbName));
    let exist = fromLS.find((item) => item.id === req.body.id);
    if (exist) {
      return res.status(409).send("already exists!");
    } else {
      // console.log(req.body);
      let newObj = {};
      newObj.id = req.body.id;
      newObj.created_at = req._startTime;
      newObj.name = req.body.name;
      // console.log("Obj: ", newObj);
      fromLS.push(newObj);
      localStorage.setItem(dbName, JSON.stringify(fromLS));
      return res.status(201).send("created!");
    }
    // console.log(req.body);
    // console.log(req._startTime);
  });

  app.delete("/:dbName", (req, res) => {
    let dbName = req.params.dbName;
    let fromLS = JSON.parse(localStorage.getItem(dbName));
    // console.log("fromLS: ", fromLS);
    let key = Object.keys(req.query)[0];
    let value = req.query[key];
    let searchingValue = value.split(".")[1];
    // console.log("key: ", key);
    // console.log("value", searchingValue);
    // console.log("fromLS: ", fromLS.length);
    let targetIndex = fromLS.findIndex((item) => item[key] == searchingValue);
    // console.log(targetIndex);
    if (targetIndex > -1) {
      fromLS.splice(targetIndex, 1);
      // console.log("hereee ", fromLS);
      localStorage.setItem(dbName, JSON.stringify(fromLS));
      return res.status(204);
    } else {
      // console.log("here");
      return res.status(404).send("it doesn't exists!");
    }
  });

  app.patch("/:dbName", (req, res) => {
    let dbName = req.params.dbName;
    let fromLS = JSON.parse(localStorage.getItem(dbName));
    let key = Object.keys(req.query)[0];
    let value = req.query[key];
    let searchingValue = value.split(".")[1];
    // console.log("key: ", key);
    // console.log("value", searchingValue);
    // console.log("body: ", req.body);
    let targetIndex = fromLS.findIndex((item) => item[key] == searchingValue);
    if (targetIndex !== -1) {
      fromLS.splice(targetIndex, 1);
      let newObj = {};
      newObj.id = searchingValue;
      newObj.created_at = req._startTime;
      newObj.name = req.body.name;
      fromLS.splice(targetIndex, 0, newObj);
      localStorage.setItem(dbName, JSON.stringify(fromLS));
      return res.status(204).send("updated!");
    } else {
      return res.status(404).send("it doesn't exists!");
    }
  });
}
