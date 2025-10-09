@echo off
echo ========================================
echo     MCP UNINSTALLER
echo ========================================
echo.
echo This will remove MCP server configurations.
echo.

set /p CONFIRM=Are you sure you want to uninstall? (Y/N):
if /i "%CONFIRM%" NEQ "Y" (
    echo Uninstall cancelled.
    pause
    exit /b 0
)

echo.
echo Removing MCP server registrations...

call claude mcp remove webflow 2>nul
if %ERRORLEVEL% EQU 0 (
    echo - Removed Webflow server
)

call claude mcp remove everything 2>nul
if %ERRORLEVEL% EQU 0 (
    echo - Removed Everything server
)

echo.
echo Removing local configuration files...
if exist ".cursor\mcp.json" (
    del ".cursor\mcp.json"
    echo - Removed .cursor\mcp.json
)

echo.
echo ========================================
echo     UNINSTALL COMPLETE
echo ========================================
echo.
echo Note: Global npm packages were not removed.
echo To remove them manually, run:
echo   npm uninstall -g @anthropic/claude-cli
echo   npm uninstall -g @modelcontextprotocol/server-everything
echo.
pause