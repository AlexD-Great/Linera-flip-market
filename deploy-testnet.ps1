# Windows PowerShell deployment script for Linera Flip Market
# Follows the deployment steps from Hackathon Canon

Write-Host "`n=== Linera Flip Market - Testnet Conway Deployment ===" -ForegroundColor Cyan
Write-Host "This script will deploy your contract to Linera testnet Conway`n" -ForegroundColor White

# Step 1: Build WASM binaries
Write-Host "Step 1: Building WASM binaries..." -ForegroundColor Yellow
Write-Host "Running: cargo build --release --target wasm32-unknown-unknown`n" -ForegroundColor Gray

cargo build --release --target wasm32-unknown-unknown

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n✗ Build failed!" -ForegroundColor Red
    Write-Host "Please fix the compilation errors and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n✓ Build successful!" -ForegroundColor Green

# Verify WASM files exist
$contractWasm = "target\wasm32-unknown-unknown\release\flip_market_contract.wasm"
$serviceWasm = "target\wasm32-unknown-unknown\release\flip_market_service.wasm"

if (-not (Test-Path $contractWasm)) {
    Write-Host "✗ Contract WASM not found at: $contractWasm" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $serviceWasm)) {
    Write-Host "✗ Service WASM not found at: $serviceWasm" -ForegroundColor Red
    exit 1
}

Write-Host "✓ WASM files verified:" -ForegroundColor Green
Write-Host "  - $contractWasm" -ForegroundColor Gray
Write-Host "  - $serviceWasm" -ForegroundColor Gray

# Step 2: Check for Linera CLI
Write-Host "`nStep 2: Checking Linera CLI..." -ForegroundColor Yellow

if (-not (Get-Command linera -ErrorAction SilentlyContinue)) {
    Write-Host "✗ Linera CLI not found!" -ForegroundColor Red
    Write-Host "`nPlease install Linera CLI first:" -ForegroundColor Yellow
    Write-Host "  Option 1 (Recommended): Use WSL2" -ForegroundColor Cyan
    Write-Host "    wsl --install" -ForegroundColor White
    Write-Host "    Then run this script from WSL" -ForegroundColor White
    Write-Host "`n  Option 2: Build from source" -ForegroundColor Cyan
    Write-Host "    git clone https://github.com/linera-io/linera-protocol.git -b testnet_conway" -ForegroundColor White
    Write-Host "    cd linera-protocol" -ForegroundColor White
    Write-Host "    cargo build --release -p linera-service" -ForegroundColor White
    Write-Host "    Add target/release to PATH" -ForegroundColor White
    exit 1
}

$lineraVersion = linera --version 2>$null
Write-Host "✓ Linera CLI found: $lineraVersion" -ForegroundColor Green

# Step 3: Initialize wallet (if needed)
Write-Host "`nStep 3: Checking wallet..." -ForegroundColor Yellow

$walletPath = "$env:USERPROFILE\.linera\wallet.json"
if (-not (Test-Path $walletPath)) {
    Write-Host "No wallet found. Initializing new wallet..." -ForegroundColor Yellow
    Write-Host "Running: linera wallet init --with-new-chain`n" -ForegroundColor Gray
    
    linera wallet init --with-new-chain
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Wallet initialization failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "`n✓ Wallet initialized successfully!" -ForegroundColor Green
} else {
    Write-Host "✓ Wallet already exists at: $walletPath" -ForegroundColor Green
}

# Step 4: Deploy to testnet
Write-Host "`nStep 4: Deploying to Linera testnet Conway..." -ForegroundColor Yellow
Write-Host "Running: linera project publish-and-create .`n" -ForegroundColor Gray

# Capture the output
$deployOutput = linera project publish-and-create . 2>&1 | Out-String

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Deployment successful!" -ForegroundColor Green
    
    # Try to extract Application ID from output
    if ($deployOutput -match "Application ID: ([a-f0-9]+)") {
        $appId = $matches[1]
        Write-Host "`nApplication ID: $appId" -ForegroundColor Cyan
        
        # Save deployment info
        $deployInfo = @{
            application_id = $appId
            deployed_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
            network = "testnet_conway"
        } | ConvertTo-Json -Depth 10
        
        $deployInfo | Out-File -FilePath "deployment-info.json" -Encoding UTF8
        Write-Host "✓ Deployment info saved to: deployment-info.json" -ForegroundColor Green
    } else {
        Write-Host "`nDeployment output:" -ForegroundColor Yellow
        Write-Host $deployOutput -ForegroundColor Gray
    }
    
    # Step 5: Instructions for starting service
    Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
    Write-Host "`n1. Start the Linera service:" -ForegroundColor Yellow
    Write-Host "   linera service --port 8080" -ForegroundColor White
    Write-Host "`n2. Your GraphQL endpoint will be available at:" -ForegroundColor Yellow
    Write-Host "   http://localhost:8080" -ForegroundColor White
    Write-Host "`n3. Update frontend configuration:" -ForegroundColor Yellow
    Write-Host "   Create web/.env.local with:" -ForegroundColor White
    Write-Host "   NEXT_PUBLIC_LINERA_GRAPHQL_ENDPOINT=http://localhost:8080" -ForegroundColor Gray
    Write-Host "   NEXT_PUBLIC_APPLICATION_ID=<your_app_id>" -ForegroundColor Gray
    Write-Host "   NEXT_PUBLIC_CHAIN_ID=<your_chain_id>" -ForegroundColor Gray
    Write-Host "`n4. Test your deployment:" -ForegroundColor Yellow
    Write-Host "   Open http://localhost:8080 in your browser" -ForegroundColor White
    
} else {
    Write-Host "`n✗ Deployment failed!" -ForegroundColor Red
    Write-Host "`nError output:" -ForegroundColor Yellow
    Write-Host $deployOutput -ForegroundColor Gray
    Write-Host "`nPlease check the error messages above and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Cyan
