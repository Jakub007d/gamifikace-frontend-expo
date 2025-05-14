# Dokumentácia aplikácie Gamifikace

## Lokálne spustenie aplikácie

1. **Je potrebné mať nainštalovaný Node.js a npm**

   - **Windows**: Stiahnite si inštalačný balík pre **Windows** z [oficiálnej stránky Node.js](https://nodejs.org/). Po inštalácii je možné skontrolovať inštaláciu pomocou príkazu:

     ```bash
     node -v
     npm -v
     ```

   - **Mac**: Môžete použiť **Homebrew** na inštaláciu Node.js:

     ```bash
     brew install node
     ```

     Skontrolujte inštaláciu:

     ```bash
     node -v
     npm -v
     ```

   - **Linux**: Na distribúciách ako **Ubuntu** alebo **Debian** použite príkaz:
     ```bash
     sudo apt update
     sudo apt install nodejs npm
     ```
     Na iných distribúciách použite ich správcu balíčkov. Skontrolujte inštaláciu:
     ```bash
     node -v
     npm -v
     ```

2. **Inštalácia expo cli**

   ```bash
   npm install -g expo-cli
   ```

3. **Nainštalovanie závyslostí**

   ```bash
    npm install
   ```

4. **Aplikáciu je možno spustiť na vývojovom serveri**

   ```bash
    npx expo start
   ```

   a následne pri stlačení tlačítka `w` bude aplikácia spustená na webovom rozhraní

5. **Pokiaľ je zároveň spustený lokálne aj backend aplikácie je potrebné zmeniť url backendu**
   Toto je potrebné urobiť v súbore `api\constants.tsx`. Taktiež je tu možné vložiť svoj open api token

## Vygenerovanie webových súborov

Vygenerovanie statických súborov na nasadenie na web je možné pomocou

```bash
 npx expo export --platform web
```

## Vygenerovanie inštalačného súboru .apk pre android

Toto je možné pomocou služby EAS pre to je však potrebné mať vytvorený účet na [expo-dev](https://expo.dev) a následne príkazom

```bash
 eas build --profile preview --platform android
```

## Vygenerovanie inštalačného súboru pre iOS

Toto je možné pomocou služby EAS pre to je však potrebné mať vytvorený účet na [expo-dev](https://expo.dev) a taktiež apple developer account ktorý stojí 100€ (nebolo testované) a následne príkazom

```bash
 eas build --profile preview --platform ios
```

## Vygenerovanie dokumentácie

Toto je možné pomocou príkazu `npm run docs` dokumentácia sa následne nachadza v korenovom súbore projektu v zložke docs
