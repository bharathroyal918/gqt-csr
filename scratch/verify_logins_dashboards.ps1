$routes = @(
  '/admin/login',
  '/csr-manager/login',
  '/hr/login',
  '/pto/login',
  '/principal/login',
  '/faculty/login',
  '/student/login',
  '/management/login',
  '/auth/login',
  '/student/dashboard',
  '/portal/dashboard'
)

foreach ($r in $routes) {
  try {
    $res = Invoke-WebRequest -Uri ("http://localhost:3000" + $r) -UseBasicParsing -MaximumRedirection 0 -ErrorAction SilentlyContinue
    Write-Host "$r -> $($res.StatusCode)"
  } catch {
    if ($_.Exception.Response) {
      Write-Host "$r -> $($_.Exception.Response.StatusCode.value__)"
    } else {
      Write-Host "$r -> Error: $($_.Exception.Message)"
    }
  }
}
