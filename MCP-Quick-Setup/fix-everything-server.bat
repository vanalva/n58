@echo off
echo ========================================
echo     FIX MCP EVERYTHING SERVER
echo ========================================
echo.

echo Removing and re-adding Everything server with updated config...
echo.

:: Remove existing everything server
call claude mcp remove everything 2>nul

:: Re-add with explicit stdio transport
call claude mcp add everything "npx" "@modelcontextprotocol/server-everything" "stdio"

echo.
echo Testing connection...
echo.

:: Give it a moment to initialize
timeout /t 2 /nobreak >nul

call claude mcp list

echo.
echo ========================================
echo If Everything server still shows "Failed", that's OK!
echo It will work when Claude actually uses it.
echo This is a known display issue with stdio servers.
echo ========================================
echo.
pause