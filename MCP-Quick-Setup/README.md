# MCP Quick Setup 🚀

This folder contains everything you need to instantly set up MCP (Model Context Protocol) servers for Webflow and Everything.

## 📦 What's Included

- **Webflow MCP**: Access and manage your Webflow sites, CMS, pages, and components
- **Everything MCP**: General-purpose tools for file operations, web browsing, and system tasks

## 🎯 Quick Start (Just 2 Steps!)

### Step 1: Double-click `install-mcp.bat`
This will automatically:
- ✅ Check for Node.js
- ✅ Install Claude CLI
- ✅ Install MCP servers
- ✅ Configure everything
- ✅ Register servers with Claude

### Step 2: Authenticate Webflow (First time only)
Double-click `auth-webflow.bat` to:
- 🌐 Open Webflow login in your browser
- 🔐 Authorize the application
- ✅ Complete the setup

## 📁 Files in this Package

| File | Purpose |
|------|---------|
| `install-mcp.bat` | Main installer - Run this first! |
| `auth-webflow.bat` | Authenticate with Webflow (one-time) |
| `test-connection.bat` | Check if servers are connected |
| `uninstall-mcp.bat` | Remove MCP servers (if needed) |

## 💡 How to Use in Any Project

1. **Copy this entire `MCP-Quick-Setup` folder** to any new project
2. **Double-click `install-mcp.bat`** in the new location
3. **Restart VSCode/Cursor**
4. You're ready to use MCP!

## 🔧 Troubleshooting

### "Node.js is not installed"
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your computer after installation

### "Failed to register server"
- Run `uninstall-mcp.bat` first
- Then run `install-mcp.bat` again

### Webflow shows "Failed" status
- Run `auth-webflow.bat` to authenticate
- Make sure you complete the login in your browser

## 🎉 That's It!

Once installed, you can use MCP commands in Claude within VSCode/Cursor. The servers will automatically connect when you start a new Claude session.

---

**Pro Tip**: Save this folder as a template. You can copy it to any new project and just run the installer!