FROM eclipse-temurin:17-jdk-jammy

# Install wget and update certificates
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates \
    wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    update-ca-certificates

# Create a non-root user and setup directories
RUN useradd -m -s /bin/bash javauser && \
    mkdir -p /sandbox/compiled-classes && \
    chown -R javauser:javauser /sandbox

# Set working directory and switch user
WORKDIR /sandbox
USER javauser

# Copy the Java executor
COPY --chown=javauser:javauser CodeExecutor.java /sandbox/

# Download Gson
RUN wget https://repo1.maven.org/maven2/com/google/code/gson/gson/2.8.9/gson-2.8.9.jar

# Compile the executor
RUN javac -cp gson-2.8.9.jar CodeExecutor.java

# Set the classpath
ENV CLASSPATH=/sandbox:/sandbox/gson-2.8.9.jar

# Set the entry point
ENTRYPOINT ["java", "CodeExecutor"]
