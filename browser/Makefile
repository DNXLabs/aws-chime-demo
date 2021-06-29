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
		"npm run build"
.PHONY: install

run: .env install
	@echo "make run"
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm --service-ports serverless \
		"npm run start:hot"
.PHONY: run

test: .env install
	@echo "make test"
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm --service-ports serverless \
		"npm run start --app=meetingReadinessChecker"
.PHONY: test


session: .env install
	@echo "make session"
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm --service-ports serverless \
		"npm run start --app=messagingSession"
.PHONY: session

shell-aws: .env
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm --service-ports serverless \
		"sh"

shell-sls: .env
	@echo "make shell-sls"
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm --service-ports serverless \
	"/bin/bash"
.PHONY: shell-sls