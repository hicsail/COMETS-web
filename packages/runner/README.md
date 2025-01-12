# COMETS-Runner

## Running Locally

### 1. Make Config

* Copy `.env.sample` to `.env`

* Modify as needed, you will need settings you established in the top level README instructions

### 2. Install Requirements

* It is recommended to create some virtual environment (venv, conda, etc)
* Navigate to `./libs/cometspy`
* Run `pip install .` to install `cometspy`
* From the top level of the runner, run `pip install -r requirements.txt`

### 3. Running through the CLI

The CLI is now ready to be used. Sample commands are listed below.

## Sample Scripts

### No Saving and No Notifications

The example below will run the simulation, not save the files to an S3 bucket, nor send a notification along the BullMQ queue.

The example is a Test Tube environment with E. Coli running for 3550 cycles.

```bash
python main.py \
  --s3-bucket='ANYTHING' \
  --s3-folder=672141bf2f70b0bb9c08ac22 \
  --queue=completion \
  --id=672141bf2f70b0bb9c08ac22 \
  --metabolite-type='glc__D_e' \
  --metabolite-amount=0.011 \
  --layout-type='test_tube' \
  --space-width=1 \
  --grid-size=1 \
  --model-name='escherichia coli core' \
  --model-neutral-drift=False \
  --model-neutral-drift-amp=0.001 \
  --model-death-rate=0 \
  --model-linear-diffusivity=0.006 \
  --model-nonlinear-diffusivity=0.006 \
  --time-step=0.01 \
  --log-freq=20 \
  --default-diff-const=0.000006 \
  --default-v-max=10 \
  --default-km=0.00001 \
  --max-cycles=3550
```

The outputs will be located in `./sim_files/`.

### Saving and Notification

```bash
python main.py \
  --s3-bucket='YOUR BUCKET NAME' \
  --s3-folder=672141bf2f70b0bb9c08ac22 \
  --queue=completion \
  --notify \
  --s3-save \
  --id=672141bf2f70b0bb9c08ac22 \
  --metabolite-type='glc__D_e' \
  --metabolite-amount=0.011 \
  --layout-type='test_tube' \
  --space-width=1 \
  --grid-size=1 \
  --model-name='escherichia coli core' \
  --model-neutral-drift=False \
  --model-neutral-drift-amp=0.001 \
  --model-death-rate=0 \
  --model-linear-diffusivity=0.006 \
  --model-nonlinear-diffusivity=0.006 \
  --time-step=0.01 \
  --log-freq=20 \
  --default-diff-const=0.000006 \
  --default-v-max=10 \
  --default-km=0.00001 \
  --max-cycles=3550
```

By adding the `--notify` and `--s3-save` the resulting images will be saved in the S3 bucket and the BullMQ queue will get a notification of the task completion. This can be used in combination with a backend listening to the BullMQ queue in order to test the result viewing.

## Deployment

### Description

Since the COMETS-Runner is executed as a Kuberenetes Job, the deployment process doesn't require anything more then updating the Docker image. Each time the job is executed, the updated image is pulled down.

### Steps

### 1. Make Changes

Edit any code in the package, ensuring that the Dockerfile is updated if needed. The Dockerfile installs the local version of `cometspy` located in `lib/cometspy` so changes can be made there.

### 2. Make PR

Make a PR against the main repo, a workflow will check off to ensure the Docker image can be built (but not pushed yet). Once all checks have passed, the PR is ready to be merged.

### 3. Merge PR

Merge the PR, this will kick off a workflow which will build and push the Docker image to DockerHub. The next time COMETS-Runner is ran in the Kubernetes cluster, the newest image will be used.