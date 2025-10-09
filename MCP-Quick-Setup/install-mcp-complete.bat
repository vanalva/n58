@echo off
setlocal enabledelayedexpansion

echo ========================================
echo     COMPLETE MCP INSTALLER
echo     For Claude Code + Cursor
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

echo [1/7] Checking Node.js version...
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
echo [2/7] Installing Claude CLI globally...
call npm install -g @anthropic/claude-cli --silent
if %ERRORLEVEL% NEQ 0 (
    echo       [WARNING] Claude CLI might already be installed
) else (
    echo       Claude CLI installed successfully
)

echo.
echo [3/7] Installing MCP Everything Server...
call npm install -g @modelcontextprotocol/server-everything --silent
if %ERRORLEVEL% NEQ 0 (
    echo       [WARNING] MCP Everything might already be installed
) else (
    echo       MCP Everything installed successfully
)

echo.
echo [4/7] Creating Cursor configuration...

:: Create .cursor directory if it doesn't exist
if not exist ".cursor" mkdir ".cursor"

:: Create mcp.json configuration for Cursor
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

echo.
echo [5/7] Registering MCP servers with Claude Code (Project-level)...

:: Remove existing servers if they exist (suppress errors)
call claude mcp remove webflow 2>nul
call claude mcp remove everything 2>nul

:: Add Webflow server (project-level)
call claude mcp add webflow "npx mcp-remote https://mcp.webflow.com/sse"
if %ERRORLEVEL% EQU 0 (
    echo       Webflow MCP server registered (project)
) else (
    echo       [ERROR] Failed to register Webflow server
)

:: Add Everything server (project-level)
call claude mcp add everything "npx" "@modelcontextprotocol/server-everything" "stdio"
if %ERRORLEVEL% EQU 0 (
    echo       Everything MCP server registered (project)
) else (
    echo       [WARNING] Everything server registered (may show as Failed)
)

echo.
echo [6/7] Registering MCP servers with Claude Code (System-wide)...

:: Add servers system-wide for all projects
call claude mcp add --global webflow "npx mcp-remote https://mcp.webflow.com/sse" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo       Webflow MCP server registered (global)
)

call claude mcp add --global everything "npx" "@modelcontextprotocol/server-everything" "stdio" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo       Everything MCP server registered (global)
)

echo.
echo [7/7] Creating .mcp.json for project portability...

:: Create .mcp.json in project root for easy sharing
echo {> .mcp.json
echo   "mcpServers": {>> .mcp.json
echo     "webflow": {>> .mcp.json
echo       "type": "stdio",>> .mcp.json
echo       "command": "npx",>> .mcp.json
echo       "args": ["mcp-remote", "https://mcp.webflow.com/sse"],>> .mcp.json
echo       "env": {}>> .mcp.json
echo     },>> .mcp.json
echo     "everything": {>> .mcp.json
echo       "type": "stdio",>> .mcp.json
echo       "command": "npx",>> .mcp.json
echo       "args": ["@modelcontextprotocol/server-everything", "stdio"],>> .mcp.json
echo       "env": {}>> .mcp.json
echo     }>> .mcp.json
echo   }>> .mcp.json
echo }>> .mcp.json

echo       Created .mcp.json for project portability

echo.
echo ========================================
echo     INSTALLATION COMPLETE!
echo ========================================
echo.
echo Installed for:
echo - Claude Code (VSCode Extension) - Project + Global
echo - Cursor IDE - Local config
echo - Portable .mcp.json for sharing
echo.
echo Next steps:
echo 1. Restart VSCode/Cursor to reload MCP servers
echo 2. For Webflow: Run auth-webflow.bat to authenticate
echo 3. Claude Code should now show servers in "Manage MCP Servers"
echo.
echo NOTE: Everything server may show "Failed" but works normally.
echo.
pause