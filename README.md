# URL Shortener Project

This guide provides all the necessary requirements and instructions to set up and run the URL Shortener project on **Windows** and **macOS** systems.

## 1. Prerequisites (All Platforms)

Before running the project, ensure you have the following software installed.

### Java Development Kit (JDK)
- **Version**: JDK 17
- **Required For**: Backend Service (Spring Boot)
- **Download Link**: [Eclipse Adoptium (Temurin) JDK 17](https://adoptium.net/temurin/releases/?version=17)

### Apache Maven
- **Version**: 3.9.x or higher
- **Required For**: Building the Backend
- **Download Link**: [Apache Maven Download](https://maven.apache.org/download.cgi)

### Node.js & npm
- **Version**: Node.js 20 (LTS) or higher
- **Required For**: Frontend Application (React + Vite)
- **Download Link**: [Node.js Download](https://nodejs.org/en/download/)

---

## 2. Windows Setup Instructions

### Step 1: Configure Hosts File
To access the application via `nano.link`, map the domain to your local machine.

1.  Click **Start**, type `Notepad`.
2.  **Right-click** on Notepad and select **Run as administrator**.
3.  Go to **File > Open** and navigate to: `C:\Windows\System32\drivers\etc`
4.  Change the file type dropdown to "**All Files (*.*)**".
5.  Select the `hosts` file.
6.  Add this line at the bottom:
    ```
    127.0.0.1    nano.link
    ```
7.  **Save** (Ctrl+S).

### Step 2: Install Dependencies
Open Command Prompt/PowerShell in the project root and run:
```cmd
npm install
```

### Step 3: Start the Backend
Open **PowerShell** in the `backend` directory and run:
```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1
```
> **Note:** If the script fails to find Java, edit `run.ps1` to point to your specific JDK 17 installation path (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot`).

### Step 4: Start the Frontend
Open **Command Prompt** in the project root and run:
```cmd
cmd /c "npm run dev"
```

---

## 3. macOS Setup Instructions

### Step 1: Configure Hosts File
1.  Open **Terminal**.
2.  Open the hosts file with administrative privileges:
    ```bash
    sudo nano /etc/hosts
    ```
3.  Enter your password when prompted.
4.  Add the following line at the bottom of the file:
    ```
    127.0.0.1    nano.link
    ```
5.  Press **Ctrl+O**, **Enter** to save, then **Ctrl+X** to exit.

### Step 2: Install Dependencies
Open Terminal in the project root and run:
```bash
npm install
```

### Step 3: Start the Backend
You can use the bundled Maven wrapper or a globally installed Maven.

1.  Open Terminal in the `backend` directory.
2.  Set your JAVA_HOME (optional, if not already set globally):
    ```bash
    export JAVA_HOME=$(/usr/libexec/java_home -v 17)
    ```
3.  Run the application using the bundled Maven script:
    ```bash
    chmod +x ./maven/bin/mvn
    ./maven/bin/mvn spring-boot:run
    ```
    *Alternatively, if you have Maven installed via Homebrew (`brew install maven`):*
    ```bash
    mvn spring-boot:run
    ```

### Step 4: Start the Frontend
Open a new Terminal tab/window in the project root and run:
```bash
npm run dev
```

---

## 4. Accessing the Application

Once both servers are running:
- Open your web browser.
- Go to: **[http://nano.link:5173](http://nano.link:5173)**

You should now see the URL Shortener application running locally with the custom domain.
