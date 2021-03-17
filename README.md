# Donatela - Die Spendenplattform

## Run

```
docker-compose up --build
```

- Interaktives Benutzerinterface:

  Der Eingangspunkt der Webapplikation ist unter https://localhost:8443/ zu finden.<br/>
  Vor erstmaligem Einloggen muss ein Benutzerkonto erstellt werden unter:<br/>
  https://localhost:8443/#/register <br/>

- Admin Interface:

  Der Login für das Admin Interface ist unter https://localhost:8443/#/LoginAdmin zu finden.<br/>
  Admin credentials: <br/>

  - username: Admin
  - password: pwd

- B2B Schnittstelle:

  Die fuer B2B Use Cases bereit gestellte GraphQl Schnittstelle ist unter https://localhost:8443/graphql zu finden.<br/>
  Dokumentation und Schnittstellenbeschreibung im Visuellen "graphiql" interface.

## Use Cases (C2B)

  Beispieluser für Login ohne Account Erstellung:
  - username: hans
  - password: pwd

- Benutzerkonto erstellen:<br/>
  https://localhost:8443/#/register

- Organisation finden:<br/>
  Nach erfolgreichem Login in der "Home" Seite mithilfe der Schaltfläche "Match".<br/>
  Oder:<br/>
  https://localhost:8443/#/organizations

- Spenden: <br/>
  Nach dem eine Passende Organisation ausgewählt wurde auf der "Organisation" oder "matching_organisations" Seite mithilfe der Schaltfläche "donate".

- Benutzerkonto löschen:<br/>
  Nach erfolgreichem Einloggen in der Navigationsleiste unter dem Benutzer-Symbol zu finden.<br/>
  Die User Settings sind hierbei nur eine Impression. Das löschen des Kontos erfolgt unter der Schaltfläche "Löschen".<br/>
  https://localhost:8443/#/user
