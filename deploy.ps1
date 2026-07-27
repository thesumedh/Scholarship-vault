param(
    [string]$network = "preprod"
)

$env:MIDNIGHT_NETWORK = $network

# Load environment variables from the corresponding .env file
$envFile = ".env.$network"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#\s]+?)\s*=\s*(.*?)\s*$') {
            $name = $matches[1]
            $value = $matches[2].Trim('"').Trim("'")
            Set-Item -Path "Env:\$name" -Value $value
        }
    }
}

# Increase Node.js memory limit to prevent Out Of Memory errors during wallet sync
$env:NODE_OPTIONS = "--max-old-space-size=8192"

# Run the deployment script using npx and vite-node
npx vite-node scripts/deploy.ts
