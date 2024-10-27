FROM python:3.11.10-bookworm

RUN apt-get update && apt-get install -y default-jre

WORKDIR /comets
COPY ./lib/cometspy .
RUN cd cometspy
RUN pip3 install .

VOLUME ["/.cache"]

WORKDIR /app

COPY . .

ENV PYTHONUNBUFFERED=1

RUN pip3 install --no-cache-dir -r requirements.txt

ENTRYPOINT ["python3", "main.py"]
