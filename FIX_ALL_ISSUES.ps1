#!/usr/bin/env pwsh
# Fix All Critical Issues Script

Write-Host "========================================"
Write-Host "  FIXING ALL CRITICAL ISSUES"
Write-Host "========================================"
Write-Host ""

# Issue 1: Remove duplicate lib/lib directory
Write-Host "[1/3] Fixing lib/lib directory structure..."
if (Test-Path "lib/lib") {
    Remove-Item -Path "lib/lib" -Recurse -Force
    Write-Host "  OK Removed lib/lib duplicate directory"
} else {
    Write-Host "  OK lib/lib already clean"
}

# Issue 2: Remove duplicate hooks/hooks directory
Write-Host "[2/3] Fixing hooks/hooks directory structure..."
if (Test-Path "hooks/hooks") {
    Remove-Item -Path "hooks/hooks" -Recurse -Force
    Write-Host "  OK Removed hooks/hooks duplicate directory"
} else {
    Write-Host "  OK hooks/hooks already clean"
}

# Issue 3: Check events structure
Write-Host "[3/3] Checking app/events/events structure..."
if (Test-Path "app/events/events") {
    Write-Host "  WARNING Found app/events/events - may need manual review"
} else {
    Write-Host "  OK No duplicate events directory found"
}

Write-Host ""
Write-Host "========================================"
Write-Host "  STRUCTURE FIXES COMPLETE"
Write-Host "========================================"
Write-Host ""

# Verify final structure
Write-Host "Verifying final structure..."
Write-Host ""

$paths = @("lib/auth", "lib/data", "lib/supabase", "lib/types", "lib/utils", "hooks")
foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "  OK $path"
    } else {
        Write-Host "  FAIL $path - MISSING"
    }
}

Write-Host ""
Write-Host "Checking for duplicate directories..."
$badPaths = @("lib/lib", "hooks/hooks")
$allGood = $true
foreach ($badPath in $badPaths) {
    if (Test-Path $badPath) {
        Write-Host "  FAIL $badPath still exists"
        $allGood = $false
    } else {
        Write-Host "  OK $badPath removed"
    }
}

Write-Host ""
if ($allGood) {
    Write-Host "========================================"
    Write-Host "  ALL FIXES APPLIED SUCCESSFULLY"
    Write-Host "========================================"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "  1. Run: npm install"
    Write-Host "  2. Read: DATABASE_SETUP.md"
    Write-Host "  3. Run: npm run dev"
} else {
    Write-Host "========================================"
    Write-Host "  SOME ISSUES REMAIN"
    Write-Host "========================================"
    Write-Host ""
    Write-Host "Please review the errors above."
}

Write-Host ""
