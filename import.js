var FormData = require("form-data");
var fetch = require("node-fetch");
const mql = require("@microlink/mql");
require("dotenv").config();

async function runScript() {
  console.log("Starting slate importer");
  let bookId = Math.floor(Math.random() * 1000);
  let gbData = await fetch("https://gutendex.com/books/" + bookId).then(
    (response) => {
      return response.json();
    }
  );

  let numbers = gbData.id.toString().split("");
  let idArray = numbers.map(Number);
  idArray.pop();

  let dir = "";
  for (let id in idArray) {
    dir += "/" + idArray[id];
  }

  //directory structure for project gutenberg mirror websites
  //https://[mirrorUrl].com/1/2/3/123/123-h/123-h.htm
  let mirrorUrl =
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

    const slate = json;
    slate.slate.data.objects[0].name = data.title;
    slate.slate.data.objects[0].body = data.description;
    slate.slate.data.objects[0].source =
      "https://www.gutenberg.org/ebooks/" + bookId;

    const responseData = await fetch("https://slate.host/api/v1/update-slate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // NOTE: your API key
        Authorization: "Basic " + process.env.API_KEY,
      },
      body: JSON.stringify({ data: slate }),
    });
    const jsonData = await responseData.json();
    console.log("Done!");
  }
}

runScript();
