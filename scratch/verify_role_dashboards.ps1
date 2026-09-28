$roles = @(
  @{ role = 'super_admin'; path = '/portal/dashboard' },
  @{ role = 'csr_manager'; path = '/portal/dashboard' },
  @{ role = 'pto'; path = '/portal/dashboard' },
  @{ role = 'principal'; path = '/portal/dashboard' },
  @{ role = 'hr_recruiter'; path = '/portal/dashboard' },
  @{ role = 'faculty_coordinator'; path = '/portal/dashboard' },
  @{ role = 'management'; path = '/portal/dashboard' },
  @{ role = 'student'; path = '/student/dashboard' }
)

foreach ($item in $roles) {
  $role = $item.role
  $path = $item.path
  $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  $cookie = New-Object System.Net.Cookie('gqt_active_role', $role, '/', 'localhost')
  $session.Cookies.Add($cookie)

  try {
    $res = Invoke-WebRequest -Uri ("http://localhost:3000" + $path) -WebSession $session -UseBasicParsing -MaximumRedirection 0 -ErrorAction SilentlyContinue
    Write-Host "Role: $role on $path -> HTTP $($res.StatusCode)"
  } catch {
    if ($_.Exception.Response) {
      Write-Host "Role: $role on $path -> HTTP $($_.Exception.Response.StatusCode.value__)"
    } else {
      Write-Host "Role: $role on $path -> Error: $($_.Exception.Message)"
    }
  }
}

# Test student accessing portal dashboard (should redirect with 307 to /student/dashboard)
$studentSession = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$studentCookie = New-Object System.Net.Cookie('gqt_active_role', 'student', '/', 'localhost')
$studentSession.Cookies.Add($studentCookie)
try {
  $res = Invoke-WebRequest -Uri "http://localhost:3000/portal/dashboard" -WebSession $studentSession -UseBasicParsing -MaximumRedirection 0 -ErrorAction SilentlyContinue
  Write-Host "Student on /portal/dashboard -> HTTP $($res.StatusCode)"
} catch {
  Write-Host "Student on /portal/dashboard -> HTTP $($_.Exception.Response.StatusCode.value__) Redirect Location: $($_.Exception.Response.Headers.Location)"
}
