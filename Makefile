ASSUME_REQUIRED?=.env.assume

export PATH_DEPLOY=.deploy
export AWS_DEFAULT_REGION?=ap-southeast-2

env-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "Environment variable $* not set"; \
		exit 1; \
	fi

.env:
	@echo "make .env"
	cp $(PATH_DEPLOY)/.env.template $(PATH_DEPLOY)/.env
	echo >> $(PATH_DEPLOY)/.env

install: .env
	@echo "make install"
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm serverless \
		"npm install"
.PHONY: install

deploy: .env env-S3_BUCKET_NAME env-STACK_NAME env-APP
	@echo "make run"
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm --service-ports serverless \
		"npm run deploy -- -r ${AWS_DEFAULT_REGION} -b ${S3_BUCKET_NAME} -s ${STACK_NAME} -a ${APP}"
.PHONY: deploy

shell-aws: .env
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm --service-ports serverless \
		"sh"

shell-sls: .env env-S3_BUCKET_NAME env-STACK_NAME env-APP
	@echo "make shell-sls"
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm serverless \
	"/bin/bash"
.PHONY: shell-sls