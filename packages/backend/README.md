# COMETS-Web Backend

## Running Locally

### 1. Make Config

* Copy `.env.sample` to `.env`

* Modify as needed, you will need settings you established in the top level README instructions

### 2.  Install Requirements and Run

```bash
npm install
npm run start:dev
```

## Deployment

### Description

The COMETS-Backend is just a NestJS project so the deployment is handled as having an image deployed with an accessible URL.

### Steps

### 1. Make Changes

Edit any code in the package, ensuring that the Dockerfile is updated if needed.

### 2. Make PR

Make a PR against the main repo, a workflow will check off to ensure the Docker image can be built (but not pushed yet). Once all checks have passed, the PR is ready to be merged.

### 3. Merge PR

Merge the PR, this will kick off a workflow which will build and push the Docker image to DockerHub.

### 4. Restart Rollout

OpenShift in NERC currently has an issue related to automatically redeploying so the instance needs to be manually rolledout. 

*  Navigate to the [OpenShift Project](https://console.apps.shift.nerc.mghpcc.org/topology/ns/comets-smart-interface-d17eea?view=graph&selectId=9175c380-e700-4946-b199-1f1c484b0f16)
* Right click on the backend in the Topology view
* Select "Restart Rollout"

A new pod will be created with the new image loaded
