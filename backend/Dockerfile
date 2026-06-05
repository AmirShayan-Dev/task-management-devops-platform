##############
# BASE IMAGE
##############
FROM python:3.12-slim AS base

# no pyc files
ENV PYTHONDONTWRITEBYTECODE=1

# flush logs
ENV PYTHONUNBUFFERED=1

# create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# set working directory
WORKDIR /app

#######################
# DEPENDENCIES STAGE
#######################
FROM base AS builder

# install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# upgrade pip
RUN pip install --upgrade pip

# copy dependency files first for better caching
COPY requirements.txt .

# install python dependencies into a separate location
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

#################
# RUNTIME STAGE
#################
FROM base AS runtime

# copy install requirements
COPY --from=builder /install /usr/local

# copy app source code
COPY . .

# change ownership to non-root user
RUN chown -R appuser:appuser . .

# switch to non-root user
USER appuser

# expose FastAPI port
EXPOSE 8000

# healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
     CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health').read()" || exit 1

# Start
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
