FROM openjdk:11.0.12-slim-bullseye

RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /comets
COPY ./lib/cometspy .
RUN cd cometspy
RUN pip3 install .

VOLUME ["/.cache"]

WORKDIR /app

COPY . .

ENV PYTHONUNBUFFERED=1

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT ["python3", "main.py"]
