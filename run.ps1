Set-Location $PSScriptRoot
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot'
$env:Path = "$env:JAVA_HOME\bin;$PSScriptRoot\maven\bin;$env:Path"
mvn spring-boot:run
