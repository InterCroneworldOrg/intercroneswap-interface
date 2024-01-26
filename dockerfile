# Verwende das offizielle Node.js-Bild als Basis
FROM node:16

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die Dateien aus dem Repository in das Arbeitsverzeichnis
COPY . /app

# Setze Umgebungsvariable für die Build-Konfiguration
ENV CI=false

# Installiere Abhängigkeiten
RUN cp .env.production .env && npm ci

# Baue die Anwendung
RUN npm run build

# Exponiere den Port, den die Anwendung verwendet (falls erforderlich)
EXPOSE 5050

# Führe die Anwendung beim Start des Containers aus
CMD ["npm", "start"]
