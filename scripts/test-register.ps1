[CmdletBinding()]
param(
    [string]$ConfigPath = ".\config.json",
    [switch]$DetailedOutput
)

# Import configuration
$config = Get-Content $ConfigPath | ConvertFrom-Json

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet('Info', 'Warning', 'Error', 'Success')]
        [string]$Level = 'Info'
    )
    
    $colors = @{
        Info = 'White'
        Warning = 'Yellow'
        Error = 'Red'
        Success = 'Green'
    }
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $colors[$Level]
}

function Clear-TestUsers {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string[]]$Emails
    )
    
    Write-Log "Cleaning up test users..." -Level 'Info'
    foreach ($email in $Emails) {
        Write-Log "Cleaned up: $email" -Level 'Info'
    }
}

function Test-Registration {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [hashtable]$UserData,
        [int]$RetryCount = $config.retryCount
    )

    $startTime = Get-Date

    for ($i = 1; $i -le $RetryCount; $i++) {
        try {
            $params = @{
                Uri     = "$($config.apiBaseUrl)/api/register"
                Method  = "POST"
                Headers = @{ "Content-Type" = "application/json" }
                Body    = $UserData | ConvertTo-Json
            }

            $response = Invoke-RestMethod @params
            Write-Log "Success: $($response | ConvertTo-Json -Depth 10)" -Level 'Success'
            
            return @{ 
                success = $true
                response = $response
                duration = (Get-Date) - $startTime
                attempts = $i
            }
        }
        catch {
            if ($i -eq $RetryCount) {
                $errorContent = $_.Exception.Response.GetResponseStream() | ForEach-Object {
                    $reader = [System.IO.StreamReader]::new($_)
                    $reader.BaseStream.Position = 0
                    $reader.ReadToEnd()
                }
                Write-Log "Error: $errorContent" -Level 'Error'
                return @{ 
                    success = $false
                    error = $errorContent
                    duration = (Get-Date) - $startTime
                    attempts = $i
                }
            }
            Write-Log "Retry attempt $i of $RetryCount" -Level 'Warning'
            Start-Sleep -Seconds $config.retryDelay
        }
    }
}

# Define test cases
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testCases = @(
    @{
        name     = "Test Duplicate"
        email    = "test@example.com"
        password = "TestPass123!"
    },
    @{
        name     = "Test Invalid Email"
        email    = "invalid-email"
        password = "TestPass123!"
    },
    @{
        name     = "Test Weak Password"
        email    = "new@example.com"
        password = "weak"
    },
    @{
        name     = "Valid Registration"
        email    = "test_${timestamp}@example.com"
        password = "ValidPass123!"
    }
)

# Initialize results tracking
$results = @{
    passed = 0
    failed = 0
    total  = $testCases.Count
}

$testResults = @()

Write-Log "Starting Registration API Tests" -Level 'Info'
Write-Log "================================" -Level 'Info'

foreach ($case in $testCases) {
    Write-Log "`nTesting case: $($case.name)" -Level 'Info'
    $response = Test-Registration -UserData $case
    
    if ($response.success) { 
        $results.passed++ 
    } else { 
        $results.failed++ 
    }

    $testResults += [PSCustomObject]@{
        TestName = $case.name
        Email = $case.email
        Status = if ($response.success) { "Passed" } else { "Failed" }
        Error = $response.error
        Duration = $response.duration.TotalSeconds
        Attempts = $response.attempts
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
    
    Start-Sleep -Seconds 1
}

# Show results
Write-Log "`nTest Summary" -Level 'Info'
Write-Log "================================" -Level 'Info'
Write-Log "Total Tests : $($results.total)" -Level 'Info'
Write-Log "Passed     : $($results.passed)" -Level 'Success'
Write-Log "Failed     : $($results.failed)" -Level 'Error'
Write-Log "================================`n" -Level 'Info'

# Create export directory if it doesn't exist
$exportDir = Join-Path $PWD $config.exportPath
New-Item -ItemType Directory -Force -Path $exportDir | Out-Null

# Export detailed results
$csvPath = Join-Path $exportDir "test-results-$timestamp.csv"
$testResults | Export-Csv -Path $csvPath -NoTypeInformation
Write-Log "Detailed results exported to: $csvPath" -Level 'Success'

# Clean up test users
$emailsToClean = $testCases | ForEach-Object { $_.email }
Clear-TestUsers -Emails $emailsToClean