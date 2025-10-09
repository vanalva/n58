@echo off
echo ========================================
echo     WEBFLOW MCP AUTHENTICATION
echo ========================================
echo.
echo This will open your browser to authenticate with Webflow.
echo Please log in and authorize the application.
echo.
echo Opening browser...
start https://mcp.webflow.com/oauth/authorize
echo.
echo After authorizing in your browser, press any key to test the connection...
pause >nul

echo.
echo Testing Webflow MCP connection...
call claude mcp list
echo.
echo If you see "webflow: ... - Connected" above, authentication was successful!
echo.
pause