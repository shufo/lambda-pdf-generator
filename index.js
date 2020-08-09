const chromium = require("chrome-aws-lambda");
const path = require("path");
const fs = require("fs");
const os = require("os");
const AWS = require("aws-sdk");

const temporaryHtmlFile = "pdf.html";
const outputPdfFile = "output.pdf";
const s3 = new AWS.S3();

async function persistToS3(data, s3Bucket, s3Key) {
  const buffer = new Buffer.from(data, "base64");

  try {
    const destparams = {
      Bucket: s3Bucket,
      Key: s3Key,
      Body: buffer,
      ContentType: "application/pdf",
    };

    s3.putObject(destparams).promise();
  } catch (err) {
    console.log(err);
    return;
  }
}

exports.handler = async (event, context) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  await fs.writeFile(
    path.resolve(os.tmpdir(), temporaryHtmlFile),
    event.data,
    "utf8",
    (err) => {
      console.log(err);
      return;
    }
  );

  const pageUrl =
    event.url || `file://${path.resolve(os.tmpdir(), temporaryHtmlFile)}`;
  const page = await browser.newPage();
  await page.goto(pageUrl);
  await page.pdf({ path: path.resolve(os.tmpdir(), outputPdfFile) });
  await browser.close();

  const result = fs.readFileSync(path.resolve(os.tmpdir(), outputPdfFile));

  if (event.persisted) {
    await persistToS3(result.toString("base64"), event.s3Bucket, event.s3Key);
  }

  return { data: result.toString("base64") };
};
