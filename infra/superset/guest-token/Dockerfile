FROM python:3.12-alpine

WORKDIR /app
COPY server.py dashboards.json ./

USER 65534:65534
EXPOSE 8090
CMD ["python", "server.py"]
