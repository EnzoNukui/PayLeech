FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/target/payleech-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 10000
ENTRYPOINT ["sh", "-c", "exec java -Dserver.port=${PORT:-10000} -jar /app/app.jar"]
