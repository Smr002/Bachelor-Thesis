FROM openjdk:17-slim

RUN useradd -m runner && \
    mkdir /sandbox && \
    chown -R runner:runner /sandbox && \
    mkdir /sandbox/compiled-classes && \
    chown -R runner:runner /sandbox/compiled-classes

WORKDIR /sandbox
USER runner

COPY --chown=runner:runner CodeExecutor.java .

RUN javac -d /sandbox/compiled-classes CodeExecutor.java

CMD ["java", "-cp", "/sandbox/compiled-classes", "CodeExecutor"]
