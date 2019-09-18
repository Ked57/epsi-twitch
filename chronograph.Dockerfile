FROM chronograf:1.4

EXPOSE 8888

ENTRYPOINT chronograf --influxdb-url=${INFLUX_URL}