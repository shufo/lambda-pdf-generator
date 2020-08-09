# constants
export PROJECT = $(shell basename `pwd`)

MAKEFLAGS += --always-make
MAKEFLAGS += --silent
MAKEFLAGS += --ignore-errors
MAKEFLAGS += --no-print-directory

.PHONY: package
ifeq (package,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(RUN_ARGS):;@:)
endif
package: ## package lambda function : ## make package
	rm -fR node_modules
	npm install --prod
	zip -r lambda_function.zip *
	echo "INFO: created lambda_function.zip"

.PHONY: help
help: ## Show this help message : ## make help
	@echo "\nUsage: make [command] [args]\n"
	@grep -P '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ": ## "}; {printf "\t\033[36m%-20s\033[0m \033[33m%-30s\033[0m (e.g. \033[32m%s\033[0m)\n", $$1, $$2, $$3}'
	@echo "\n"

.DEFAULT_GOAL := help
