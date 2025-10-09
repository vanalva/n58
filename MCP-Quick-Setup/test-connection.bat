@echo off
echo ========================================
echo     MCP CONNECTION TEST
echo ========================================
echo.
echo Checking MCP server status...
echo.
call claude mcp list
echo.
echo ========================================
echo Connection statuses explained:
echo - Connected = Server is working properly
echo - Failed = Server needs configuration/auth
echo ========================================
echo.
pause