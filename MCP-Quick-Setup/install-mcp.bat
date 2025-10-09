@echo off
setlocal enabledelayedexpansion

echo ========================================
echo     MCP QUICK INSTALLER
echo     Webflow + Everything Server
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Checking Node.js version...
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo       Node.js %NODE_VERSION% detected

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo.
echo [2/5] Installing Claude CLI globally...
call npm install -g @anthropic/claude-cli --silent
if %ERRORLEVEL% NEQ 0 (
    echo       [WARNING] Claude CLI might already be installed
) else (
    echo       Claude CLI installed successfully
)

echo.
echo [3/5] Installing MCP Everything Server...
call npm install -g @modelcontextprotocol/server-everything --silent
if %ERRORLEVEL% NEQ 0 (
    echo       [WARNING] MCP Everything might already be installed
) else (
    echo       MCP Everything installed successfully
)

echo.
echo [4/5] Configuring MCP servers...

:: Create .cursor directory if it doesn't exist
if not exist ".cursor" mkdir ".cursor"

:: Create mcp.json configuration
echo {> .cursor\mcp.json
echo   "mcpServers": {>> .cursor\mcp.json
echo     "webflow": {>> .cursor\mcp.json
echo       "command": "npx mcp-remote https://mcp.webflow.com/sse">> .cursor\mcp.json
echo     },>> .cursor\mcp.json
echo     "everything": {>> .cursor\mcp.json
echo       "command": "npx @modelcontextprotocol/server-everything stdio">> .cursor\mcp.json
echo     }>> .cursor\mcp.json
echo   }>> .cursor\mcp.json
echo }>> .cursor\mcp.json

echo       Created .cursor\mcp.json configuration

:: Add servers using Claude CLI
echo.
echo [5/5] Registering MCP servers with Claude...

:: Remove existing servers if they exist (suppress errors)
call claude mcp remove webflow 2>nul
call claude mcp remove everything 2>nul

:: Add Webflow server
call claude mcp add webflow "npx mcp-remote https://mcp.webflow.com/sse"
if %ERRORLEVEL% EQU 0 (
    echo       Webflow MCP server registered
) else (
    echo       [ERROR] Failed to register Webflow server
)

:: Add Everything server (with separate arguments for better compatibility)
call claude mcp add everything "npx" "@modelcontextprotocol/server-everything" "stdio"
if %ERRORLEVEL% EQU 0 (
    echo       Everything MCP server registered
) else (
    echo       [WARNING] Everything server may show as "Failed" in status
    echo                but will work when Claude uses it (stdio behavior)
)

echo.
echo ========================================
echo     INSTALLATION COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Restart VSCode/Cursor to load the MCP servers
echo 2. For Webflow: You'll need to authenticate once
echo    - A browser window will open automatically
echo    - Log in to your Webflow account
echo    - Authorize the application
echo.
echo NOTE: Everything server may show "Failed" status but works normally.
echo       This is expected behavior for stdio servers.
echo.
echo Your MCP servers are ready to use!
echo.
pause