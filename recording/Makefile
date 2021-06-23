ASSUME_REQUIRED?=.env.assume

export PATH_DEPLOY=.deploy
export AWS_DEFAULT_REGION?=ap-southeast-2

IMAGE_NAME=meetingrecording
IMAGE_VERSION=latest
ENV_FILE=container.env
CONTAINER_NAME=recording
IMAGE_LABEL=$(IMAGE_NAME):$(IMAGE_VERSION)

REGION = $(word 4, $(subst ., , $(ECR_REPO_URI)))
REPO_NAME = $(lastword $(subst /, , $(ECR_REPO_URI)))
SHELL := /bin/bash

all: build_upload

build_upload: .env
	@REGEX='^[0-9]{12}\.dkr\.ecr\..+\.amazonaws\.com\/[a-z0-9_/-]+$$'; \
	if [[ $(ECR_REPO_URI) =~ $$REGEX ]]; then \
		echo "Valid ECR URI format"; else \
		echo "InvalidECR URI format"; \
		exit 1; \
	fi

	aws ecr get-login-password --region $(REGION) | docker login --username AWS --password-stdin $(ECR_REPO_URI)
	docker build -t $(REPO_NAME) .
	docker tag $(REPO_NAME):latest $(ECR_REPO_URI):latest
	docker push $(ECR_REPO_URI):latest
	@echo Image URI in ECR repository: $(ECR_REPO_URI):latest


image: .env
	docker image build -t $(IMAGE_LABEL) .

run: .env
	docker run \
		--rm \
		--env-file $(ENV_FILE) \
		--name $(CONTAINER_NAME) \
		$(IMAGE_LABEL) 2>&1 | tee $(CONTAINER_NAME).log

.PHONY: all image run

env-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "Environment variable $* not set"; \
		exit 1; \
	fi

.env:
	@echo "make .env"
	cp $(PATH_DEPLOY)/.env.template $(PATH_DEPLOY)/.env
	echo >> $(PATH_DEPLOY)/.env

deploy: .env env-S3_BUCKET_NAME env-STACK_NAME env-DOCKER_IMAGE
	@echo "make run"
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm --service-ports serverless \
		"node ./deploy.js -b ${S3_BUCKET_NAME} -s ${STACK_NAME} -r ${AWS_DEFAULT_REGION} -i ${DOCKER_IMAGE}"
.PHONY: deploy

shell-aws: .env
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm --service-ports serverless \
		"sh"

shell-sls: .env env-S3_BUCKET_NAME env-STACK_NAME env-DOCKER_IMAGE
	@echo "make shell-sls"
	docker-compose -f $(PATH_DEPLOY)/docker-compose.yml run --rm serverless \
	"/bin/bash"
.PHONY: shell-sls