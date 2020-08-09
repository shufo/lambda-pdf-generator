## Installation

Populate underlying layers (Headless chrome, fonts)

```bash
$ git clone https://github.com/shufo/lambda-cjk-font-layer.git
$ wget https://github.com/alixaxel/chrome-aws-lambda/archive/v5.1.0.zip -O chrome-aws-lambda.zip
$ unzip chrome-aws-lambda.zip
$ mv chrome-aws-lambda-5.1.0 chrome-aws-lambda
```

Apply terraform

```
$ terraform init
$ terraform apply
```
