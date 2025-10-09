@echo off
echo ========================================
echo     REFRESH CLAUDE CODE MCP
echo ========================================
echo.

echo Refreshing Claude Code MCP servers...
echo.

:: Force reload by removing and re-adding
echo [1/3] Removing existing servers...
call claude mcp remove webflow 2>nul
call claude mcp remove everything 2>nul

echo.
echo [2/3] Re-adding servers...
call claude mcp add webflow "npx mcp-remote https://mcp.webflow.com/sse"
call claude mcp add everything "npx" "@modelcontextprotocol/server-everything" "stdio"

echo.
echo [3/3] Checking status...
call claude mcp list

echo.
echo ========================================
echo IMPORTANT: Now do the following:
echo
echo 1. Press Ctrl+Shift+P in VSCode
echo 2. Type "Developer: Reload Window"
echo 3. Press Enter
echo
echo OR simply close and reopen VSCode
echo ========================================
echo.
pause