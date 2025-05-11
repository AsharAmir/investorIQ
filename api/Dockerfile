FROM python:3.9-slim

WORKDIR /app

# Install system dependencies first (some Python packages need them)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# Use the full path to gunicorn
CMD ["/usr/local/bin/gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
