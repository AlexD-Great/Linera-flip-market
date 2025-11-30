# Windows PowerShell script to check prerequisites for Linera deployment

Write-Host "`n=== Linera Flip Market - Prerequisites Check ===" -ForegroundColor Cyan
Write-Host "Checking your Windows environment for Linera deployment...`n" -ForegroundColor White

$allGood = $true

# Check Rust
Write-Host "Checking Rust installation..." -ForegroundColor Yellow
if (Get-Command rustc -ErrorAction SilentlyContinue) {
    $rustVersion = rustc --version
    Write-Host "  ✓ Rust installed: $rustVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Rust not found!" -ForegroundColor Red
    Write-Host "    Install from: https://rustup.rs/" -ForegroundColor Yellow
    $allGood = $false
}

# Check Cargo
Write-Host "`nChecking Cargo..." -ForegroundColor Yellow
if (Get-Command cargo -ErrorAction SilentlyContinue) {
    $cargoVersion = cargo --version
    Write-Host "  ✓ Cargo installed: $cargoVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Cargo not found!" -ForegroundColor Red
    $allGood = $false
}

# Check wasm32 target
Write-Host "`nChecking wasm32-unknown-unknown target..." -ForegroundColor Yellow
$targets = rustup target list --installed 2>$null
if ($targets -match "wasm32-unknown-unknown") {
    Write-Host "  ✓ wasm32-unknown-unknown target installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ wasm32-unknown-unknown not installed" -ForegroundColor Red
    Write-Host "    Installing now..." -ForegroundColor Yellow
    rustup target add wasm32-unknown-unknown
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Successfully installed wasm32-unknown-unknown" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to install wasm32-unknown-unknown" -ForegroundColor Red
        $allGood = $false
    }
}

# Check Git
Write-Host "`nChecking Git..." -ForegroundColor Yellow
if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitVersion = git --version
    Write-Host "  ✓ Git installed: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Git not found!" -ForegroundColor Red
    Write-Host "    Install from: https://git-scm.com/download/win" -ForegroundColor Yellow
    $allGood = $false
}

# Check for Linera CLI
Write-Host "`nChecking Linera CLI..." -ForegroundColor Yellow
if (Get-Command linera -ErrorAction SilentlyContinue) {
    $lineraVersion = linera --version 2>$null
    Write-Host "  ✓ Linera CLI installed: $lineraVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Linera CLI not found" -ForegroundColor Red
    Write-Host "`n  Installation options for Windows:" -ForegroundColor Yellow
    Write-Host "    1. Use WSL2 (Recommended)" -ForegroundColor Cyan
    Write-Host "       - Install WSL2: wsl --install" -ForegroundColor White
    Write-Host "       - Then follow Linux installation in WSL" -ForegroundColor White
    Write-Host "`n    2. Build from source" -ForegroundColor Cyan
    Write-Host "       - Clone: git clone https://github.com/linera-io/linera-protocol.git -b testnet_conway" -ForegroundColor White
    Write-Host "       - Build: cargo build --release -p linera-service" -ForegroundColor White
    Write-Host "       - Add to PATH: target/release" -ForegroundColor White
    $allGood = $false
}

# Check Node.js (for frontend)
Write-Host "`nChecking Node.js (for frontend)..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Node.js not found (needed for frontend)" -ForegroundColor Yellow
    Write-Host "    Install from: https://nodejs.org/" -ForegroundColor Yellow
}

# Check npm (for frontend)
Write-Host "`nChecking npm (for frontend)..." -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmVersion = npm --version
    Write-Host "  ✓ npm installed: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "  ⚠ npm not found (needed for frontend)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✓ All critical prerequisites are installed!" -ForegroundColor Green
    Write-Host "`nYou're ready to build and deploy!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. Build: cargo build --release --target wasm32-unknown-unknown" -ForegroundColor White
    Write-Host "  2. Deploy: linera project publish-and-create ." -ForegroundColor White
} else {
    Write-Host "✗ Some prerequisites are missing. Please install them first." -ForegroundColor Red
    Write-Host "`nFor Linera CLI on Windows, we recommend using WSL2:" -ForegroundColor Yellow
    Write-Host "  wsl --install" -ForegroundColor White
}

Write-Host "`n=== Prerequisites Check Complete ===" -ForegroundColor Cyan
