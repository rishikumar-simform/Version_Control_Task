
# Use an official Python image as the base image
FROM  python:3.11

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the application files
COPY . .

# Expose the port (same as the Flask app)
EXPOSE 5000

# Run the Flask application
CMD ["python", "app.py"]


