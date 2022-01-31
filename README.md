# lambda-pdf-generator

A lambda function that generates PDF with [headless chrome on lambda](https://github.com/alixaxel/chrome-aws-lambda)

## Features

- [x] Generates PDF from HTML string 
- [x] Generates PDF from URL
- [x] Persists generated PDF to S3  
- [x] CJK font support (no more tofu)

## packaging

```bash
$ make package
```

will generates `lambda_function.zip`

## Deployment

see `example` for terraform deployment example

## Parameter

### Input

|       parameter |                                                                description |  default | required |
| --------------: | -------------------------------------------------------------------------: | -------: | -------: |
|          `data` |                                     HTML string you want to convert to pdf. e.g. `<html><body>Hello World!</body></html>` |     `""` |      no |
|           `url` | Web site URL you want to print as pdf. If specified, `data` will be ignore. URL must accessible from lambda. e.g. `https://www.google.com/` |   `null` |       no |
|     `persisted` |               If you would like to persist pdf files on S3, turn on `true` |  `false` |       no |
|   `s3Bucket` |            Destination S3 bucket. Required If `persisted` is `true` |   `null` |       no |
|   `s3Key` |            Destination S3 path. Required If `persisted` is `true` |   `null` |       no |

### Output

| parameter |        description |
| --------: | -----------------: |
|    `data` | Base64 encoded pdf. e.g. `{"data":"JVBERi0xLjQKJdPr6eEKMSAw~~eEKMSAw"}`|

## Example

- Generate pdf from HTML

```bash
$ echo '{"data": "<html><body><p style=\"color: red\">Hello World</p></body></html>"}' > payload.json
$ aws lambda invoke \
 --function-name <your_deployed_lambda_function_name> \
 --invocation-type RequestResponse \
 --payload file://payload.json --cli-binary-format raw-in-base64-out response.json

 $ cat response.json | jq -r .data | base64 -d > example.pdf
 $ open example.pdf
```

![image](https://user-images.githubusercontent.com/1641039/89736141-3ceddc80-daa2-11ea-8578-5569f670c1cc.png)

The output result is same as `Save as PDF` result on Chrome (Ctrl+P)

- Generate PDF from url

```bash
$ echo '{"url": "https://amazon.com"}' > payload.json
$ aws lambda invoke \
 --function-name <your_deployed_lambda_function_name> \
 --invocation-type RequestResponse \
 --payload file://payload.json --cli-binary-format raw-in-base64-out response.json

 $ cat response.json | jq -r .data | base64 -d > example.pdf
 $ open example.pdf
```

![image](https://user-images.githubusercontent.com/1641039/89755902-f6d55f00-db1b-11ea-96d3-739d9cbac84c.png)


## Fonts

If you want to use CJK fonts in PDF like Simplified Chinese (简体中文), Traditional Chinese — Taiwan (繁體中文—臺灣), Japanese (日本語), Korean (한국어),

You can use [lambda-cjk-font-layer](https://github.com/shufo/lambda-cjk-font-layer) to enable CJK font.

## Troubleshoot

According to AWS Lambda [limitation](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html), if input payload size or response payload size exceeded 6MB, Lambda API will returns error
