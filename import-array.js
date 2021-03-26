const FormData = require("form-data");
const fetch = require("node-fetch");
const mql = require("@microlink/mql");
require("dotenv").config();
const bookData = require("./books2.json");

async function runScript(id) {
  console.log("Starting slate importer");
  const bookId = id;
  const gbData = await fetch("https://gutendex.com/books/" + bookId).then(
    (response) => {
      return response.json();
    }
  );

  //directory structure for project gutenberg mirror websites
  //https://[mirrorUrl].com/1/2/3/1234-h/1234-h.htm

  //splits the id to create the initial /1/2/3/ folder structure
  let numbers = gbData.id.toString().split("");
  let idArray = numbers.map(Number);
  //directory structure doesn't use the final number, use pop to remove
  idArray.pop();

  let dir = "";
  for (let id in idArray) {
    dir += "/" + idArray[id];
  }

  const mirrorUrl =
    "http://gutenberg.readingroo.ms" +
    dir +
    "/" +
    bookId +
    "/" +
    bookId +
    "-h/" +
    bookId +
    "-h.htm";

  const { status, data, response } = await mql(mirrorUrl, {
    pdf: true,
    scale: 1,
  });

  if (data.title == "404 Not Found") {
    console.log("There was an error retriving the PDF");
    return;
  } else {
    console.log("Adding eBook: ", data.title);
    res = await fetch(data.pdf.url, {
      encoding: null,
    });
    pdfBuffer = await res.buffer();
    pdf = new Buffer.from(pdfBuffer);

    const url = "https://uploads.slate.host/api/public/" + process.env.SLATE_ID;
    //let file = e.target.files[0];
    let form = new FormData();
    form.append("data", pdf, { filename: data.title + ".pdf" });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        // NOTE: your API key
        Authorization: "Basic " + process.env.API_KEY,
      },
      body: form,
    });
    const json = await response.json();
    // NOTE: the URL to your asset will be available in the JSON response.
    /*
    let updateData = json.data.slate.data.objects[0];
    console.log("data: ", updateData);
    updateData.name = data.title;
    updateData.body = data.description;
    updateData.source = "https://www.gutenberg.org/ebooks/" + bookId;

    const responseData = await fetch("https://slate.host/api/v1/update-slate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // NOTE: your API key
        Authorization: "Basic " + process.env.API_KEY,
      },
      body: JSON.stringify({ data: updateData }),
    });
    const jsonData = await responseData.json();
    */
    console.log("Done!");
    return;
  }
}

async function getStarted() {
  /*
  let array = ["123", "456", "789"];

  for (const item of array) {
    console.log(item);
    await runScript(item);
  }
  */
  //console.log(bookData.id);
  for (const item of bookData) {
    console.log(item.id);
    await runScript(item.id);
  }
}

getStarted();
