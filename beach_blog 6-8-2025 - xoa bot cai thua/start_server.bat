@echo off
echo Starting PHP server on localhost:8000...
echo.
echo Make sure you're in the project root directory
echo Server will serve files from the 'php' directory
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
php -S localhost:8000 -t php
pause
